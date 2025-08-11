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
const addAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agent } = req.body;
    try {
        const queryText = `
      INSERT INTO "Agent" (
        "id",
        "type",
        "model",
        "userId",
        "name",
        "systemInstructions",
        "temperature",
        "webSearch",
        "createdAt",
        "updatedAt"
      )
      SELECT
        $1::uuid,
        $2::text,
        $3::text,
        $4::uuid,
        $5::text,
        $6::text,
        $7::float,
        $8::boolean,
        $9::timestamp,
        $10::timestamp
      RETURNING *;
    `;
        const result = yield __1.pool.query(queryText, [
            agent.id,
            agent.type,
            agent.model,
            agent.userId,
            agent.name,
            agent.systemInstructions,
            agent.temperature,
            agent.webSearch,
            agent.createdAt,
            agent.updatedAt
        ]);
        if (!result)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to add agent");
        res.status(200).json({
            message: "Agent added",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error("Failed to add agent: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = addAgent;
