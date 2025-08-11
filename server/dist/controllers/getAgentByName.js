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
const getAgentByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, agentName } = req.body;
    try {
        /** Get agent from the database (PostgresDB) */
        const queryText = `
      SELECT * FROM "Agent"
      WHERE "userId" = $1::uuid
        AND "name" = $2::text
    `;
        const result = yield index_1.pool.query(queryText, [
            userId,
            agentName
        ]);
        if (!result)
            return (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch agent");
        /** On success send data (Client) */
        res.status(200).json({
            message: "Agent has been fetched",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error("Failed to fetch agent: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = getAgentByName;
