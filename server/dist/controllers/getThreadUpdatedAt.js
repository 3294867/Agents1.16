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
const getThreadUpdatedAt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId } = req.body;
    try {
        /** Get 'updatedAt' property of the thread (PostgresDB) */
        const resultQueryText = `
      SELECT "updatedAt" FROM "Thread" WHERE "id" = $1::uuid;
    `;
        const result = yield index_1.pool.query(resultQueryText, [threadId]);
        if (!result)
            (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch 'updatedAt' property of the thread");
        /** On success send data (Client) */
        res.status(200).json({
            message: "Thread fetched",
            data: result.rows[0].updatedAt
        });
    }
    catch (error) {
        console.error("Failed to fetch 'updatedAt' property of the thread: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = getThreadUpdatedAt;
