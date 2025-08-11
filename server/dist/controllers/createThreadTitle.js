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
const createThreadTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, answer } = req.body;
    try {
        /** Create thread title (OpenAI) */
        const instructions = `Generate title for a below conversation. Make it short. Return only title.
      Question: ${question}
      Answet: ${answer}
    `;
        const apiResponse = yield index_1.client.responses.create({
            model: 'gpt-4.1',
            input: instructions,
        });
        if (!apiResponse)
            return (0, sendResponse_1.sendResponse)(res, 503, "Failed to create thread title");
        /** On success send data (Client) */
        res.status(200).json({
            message: "Thread title updated",
            data: apiResponse.output_text
        });
    }
    catch (error) {
        console.error("Failed to create thread title: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = createThreadTitle;
