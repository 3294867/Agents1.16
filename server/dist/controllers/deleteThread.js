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
const __1 = require("..");
const sendResponse_1 = require("../utils/sendResponse");
const deleteThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId } = req.body;
    try {
        /** Delete thread from database (PostgresDB) */
        const queryText = `
      DELETE FROM "Thread" WHERE "id" = $1::uuid;
    `;
        const result = yield __1.pool.query(queryText, [threadId]);
        if (!result)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to delete thread");
        /** On success send message (Client) */
        res.status(200).json({
            message: "Thread deleted",
        });
    }
    catch (error) {
        console.error("Failed to delete thread: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = deleteThread;
