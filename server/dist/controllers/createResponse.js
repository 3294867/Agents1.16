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
const createResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, agentModel, input } = req.body;
    try {
        /** Get instructions from the database (PostgresDB) */
        const instructionsQueryText = `
      SELECT "systemInstructions"
      FROM "Agent"
      WHERE "id" = $1::uuid;
    `;
        const instructions = yield index_1.pool.query(instructionsQueryText, [agentId]);
        if (!instructions)
            return (0, sendResponse_1.sendResponse)(res, 404, "Failed to get instructions");
        /** Create response (OpenAI) */
        const apiResponse = yield index_1.client.responses.create({
            model: agentModel,
            input,
            instructions: instructions.rows[0].systemInstructions
        });
        if (!apiResponse)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to get response");
        /** On success send data (Client) */
        res.status(200).json({
            message: "apiResponse created",
            data: apiResponse.output_text
        });
    }
    catch (error) {
        console.error("Failed to create apiResponse: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = createResponse;
