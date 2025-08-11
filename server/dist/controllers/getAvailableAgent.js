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
const getAvailableAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentType } = req.body;
    try {
        const resultQueryText = `
      SELECT * FROM "Agent"
      WHERE "userId" = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
        AND "type" = $1::text;
    `;
        const result = yield index_1.pool.query(resultQueryText, [agentType]);
        if (!result)
            (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch available agent (PostgresDB)");
        res.status(200).json({
            message: "Available agent fetched",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error("Failed to fetch available agent (PostgresDB): ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = getAvailableAgent;
