"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const sendResponse_1 = require("../utils/sendResponse");
const deleteQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId, requestId, responseId } = req.body;
    try {
        yield index_1.pool.query("BEGIN");
        /** Delete request from Request Table (PostgresDB) */
        const requestDeletedQueryText = `
      DELETE FROM "Request"
      WHERE "id" = $1::uuid
    `;
        const requestDeleted = yield index_1.pool.query(requestDeletedQueryText, [requestId]);
        if (!requestDeleted)
            (0, sendResponse_1.sendResponse)(res, 503, "Failed to delete request");
        /** Delete response from Response Table (PostgresDB) */
        const responseDeletedQueryText = `
      DELETE FROM "Request"
      WHERE "id" = $1::uuid
    `;
        const responseDeleted = yield index_1.pool.query(responseDeletedQueryText, [responseId]);
        if (!responseDeleted)
            (0, sendResponse_1.sendResponse)(res, 503, "Failed to delete response");
        /** Get thread body from the Thread Table (PostgresDB) */
        const threadBodyQueryText = `
      SELECT "body" FROM "Thread" WHERE "id" = $1::uuid;      
    `;
        const threadBody = yield index_1.pool.query(threadBodyQueryText, [
            threadId,
        ]);
        if (!threadBody)
            (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch thread body");
        /** Update thread body in the Thread Table (PostgresDB) */
        const updatedThreadBody = threadBody.rows[0].body.filter((q) => q.requestId !== requestId);
        const threadBodyUpdatedQueryText = `
      UPDATE "Thread" SET "body" = $1::jsonb WHERE "id" = $2::uuid; 
    `;
        const threadBodyUpdated = yield index_1.pool.query(threadBodyUpdatedQueryText, [
            JSON.stringify(updatedThreadBody),
            threadId
        ]);
        if (!threadBodyUpdated)
            (0, sendResponse_1.sendResponse)(res, 503, "Failed to update thread body");
        yield index_1.pool.query("COMMIT");
        /** On success send message (Client) */
        res.status(200).json({
            message: "Query deleted",
        });
    }
    catch (error) {
        try {
            yield index_1.pool.query("ROLLBACK");
        }
        catch (rollbackError) {
            console.error("Failed to roll back changes: ", rollbackError);
        }
        console.error("Failed to update thread: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = deleteQuery;
