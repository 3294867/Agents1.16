import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { Query, Thread } from '../types';

interface Props {
  threadId: string;
}

const getThread = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    const resultQueryText = `
      SELECT 
        t."id",
        t."userId",
        t."agentId",
        t."title",
        t."body" AS "body",
        t."isBookmarked",
        t."createdAt",
        t."updatedAt"
      FROM "Thread" t
      WHERE t.id = $1::uuid;
    `;
    const result = await pool.query(resultQueryText, [threadId]);
    if (!result.rows[0]) {
      return sendResponse(res, 404, "Thread not found");
    }

    const thread: Thread = {
      id: result.rows[0].id,
      userId: result.rows[0].userId,
      agentId: result.rows[0].agentId,
      title: result.rows[0].title,
      body: result.rows[0].body.map((item: { requestId: string, responseId: string }) => ({
        requestId: item.requestId,
        responseId: item.responseId,
        requestBody: null,
        responseBody: null
      })),
      isBookmarked: result.rows[0].isBookmarked,
      createdAt: result.rows[0].createdAt,
      updatedAt: result.rows[0].updatedAt,
    };

    const bodyWithDetails = await Promise.all(
      thread.body.map(async (query: Query) => {
        const request = await pool.query('SELECT body FROM "Request" WHERE id = $1', [query.requestId]);
        const response = await pool.query('SELECT body FROM "Response" WHERE id = $1', [query.responseId]);
        return {
          requestId: query.requestId,
          requestBody: request.rows[0]?.body || null,
          responseId: query.responseId,
          responseBody: response.rows[0]?.body || null,
        };
      })
    );

    thread.body = bodyWithDetails;

    res.status(200).json({
      message: "Thread fetched",
      data: thread
    });
  } catch (error) {
    console.error("Failed to fetch thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getThread;