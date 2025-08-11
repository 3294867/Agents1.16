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
const updateResponseBody = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { responseId, responseBody } = req.body;
    try {
        /** Update response body in the database (PostgresDB) */
        const resultQueryText = `
      UPDATE "Response"
      SET "body" = $1::text
      WHERE "id" = $2::uuid 
    `;
        const result = yield index_1.pool.query(resultQueryText, [
            responseBody,
            responseId
        ]);
        if (!result)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to update response body");
        /** On success send data (Client) */
        res.status(200).json({
            message: "Response body updated",
        });
    }
    catch (error) {
        console.error("Failed to update response body: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = updateResponseBody;
