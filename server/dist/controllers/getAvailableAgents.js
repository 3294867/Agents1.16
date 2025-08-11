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
const getAvailableAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resultQueryText = `
      SELECT * FROM "Agent"
      WHERE "userId" = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid;
    `;
        const result = yield index_1.pool.query(resultQueryText);
        if (!result)
            (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch available agents (PostgresDB)");
        res.status(200).json({
            message: "Available agents fetched",
            data: result.rows
        });
    }
    catch (error) {
        console.error("Failed to fetch available agents (PostgresDB): ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = getAvailableAgents;
