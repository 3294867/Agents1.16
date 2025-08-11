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
const addQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId, requestBody, responseBody } = req.body;
    try {
        yield index_1.pool.query("BEGIN");
        /** Store request in the database (PostgresDB) */
        const requestQueryText = `
      INSERT INTO "Request" ("threadId", "body")
      VALUES ($1::uuid, $2::text)
      RETURNING "id", "createdAt";
    `;
        const request = yield index_1.pool.query(requestQueryText, [threadId, requestBody]);
        if (!request)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to add request");
        /** Store response in the database (PostgresDB) */
        const responseQueryText = `
      INSERT INTO "Response" (
        "threadId",
        "body"
      )
      SELECT
        $1::uuid AS "threadId",
        $2::text AS "body"
      Returning "id", "createdAt";
    `;
        const response = yield index_1.pool.query(responseQueryText, [
            threadId,
            responseBody
        ]);
        if (!response)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to add response");
        /** Get current thread body from database (PostgresDB) */
        const threadBodyQueryText = `
      SELECT "body"
      FROM "Thread"
      WHERE "id" = $1::uuid
    `;
        const threadBody = yield index_1.pool.query(threadBodyQueryText, [
            threadId
        ]);
        if (!threadBody)
            return (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch thread body");
        let currentBody = threadBody.rows[0].body;
        if (!Array.isArray(currentBody)) {
            currentBody = [];
        }
        ;
        const newBody = [...currentBody, {
                requestId: request.rows[0].id,
                responseId: response.rows[0].id
            }];
        /** Update thread body in the database (PostgresDB) */
        const threadQueryText = `
      UPDATE "Thread"
      SET "body" = $1::jsonb
      WHERE "id" = $2::uuid;
    `;
        const thread = yield index_1.pool.query(threadQueryText, [
            JSON.stringify(newBody),
            threadId
        ]);
        if (!thread)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to update thread");
        yield index_1.pool.query("COMMIT");
        /** On success send data (Client) */
        res.status(200).json({
            message: "Thread updated",
            data: {
                requestId: request.rows[0].id,
                responseId: response.rows[0].id
            }
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
exports.default = addQuery;
