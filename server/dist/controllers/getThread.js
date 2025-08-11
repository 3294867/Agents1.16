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
const getThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId } = req.body;
    try {
        /** Get thread from the database (PostgresDB) */
        const resultQueryText = `
      WITH ordered_requests AS (
        SELECT 
          "id",
          "threadId",
          "body",
          ROW_NUMBER() OVER (PARTITION BY "threadId" ORDER BY "createdAt") AS rn
        FROM "Request"
      ),
      ordered_responses AS (
        SELECT 
          "id",
          "threadId",
          "body",
          ROW_NUMBER() OVER (PARTITION BY "threadId" ORDER BY "createdAt") AS rn
        FROM "Response"
      )
      SELECT 
        t."id",
        t."userId",
        t."agentId",
        t."title",
        jsonb_agg(
          jsonb_build_object(
            'requestId', req.id,
            'requestBody', req.body,
            'responseId', res.id,
            'responseBody', res.body
          )
        ) AS "body",
        t."isBookmarked",
        t."createdAt",
        t."updatedAt"
      FROM "Thread" t
      LEFT JOIN ordered_requests req ON t."id" = req."threadId"
      LEFT JOIN ordered_responses res ON t."id" = res."threadId" AND req.rn = res.rn
      WHERE t.id = $1::uuid
      GROUP BY t."id", t."userId", t."agentId", t."title", t."isBookmarked", t."createdAt", t."updatedAt";
    `;
        const result = yield index_1.pool.query(resultQueryText, [threadId]);
        if (!result)
            (0, sendResponse_1.sendResponse)(res, 404, "Failed to fetch thread");
        const threadBody = result.rows[0].body[0].requestId === null
            ? []
            : result.rows[0].body;
        const thread = {
            id: result.rows[0].id,
            userId: result.rows[0].userId,
            agentId: result.rows[0].agentId,
            title: result.rows[0].title,
            body: threadBody,
            isBookmarked: result.rows[0].isBookmarked,
            createdAt: result.rows[0].createdAt,
            updatedAt: result.rows[0].updatedAt,
        };
        /** On success send data (Client) */
        res.status(200).json({
            message: "Thread fetched",
            data: thread
        });
    }
    catch (error) {
        console.error("Failed to fetch thread.: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = getThread;
