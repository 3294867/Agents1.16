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
const addThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, userId, agentId } = req.body;
    try {
        const queryText = `
      INSERT INTO "Thread" (
        "id",
        "userId",
        "agentId",
        "body"
      )
      SELECT
        $1::uuid,
        $2::uuid,
        $3::uuid,
        '{}'::jsonb
      RETURNING *;
    `;
        const result = yield __1.pool.query(queryText, [
            id,
            userId,
            agentId
        ]);
        if (!result)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to add thread");
        res.status(200).json({
            message: "Thread added",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error("Failed to add thread: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = addThread;
