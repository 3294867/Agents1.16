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
    const result = await pool.query(resultQueryText, [ threadId ]);
    if (!result) sendResponse(res, 404, "Failed to fetch thread")

    const threadBody: Query[] = result.rows[0].body[0].requestId === null
      ? []
      : result.rows[0].body;

    const thread: Thread = {
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

  } catch (error) {
    console.error("Failed to fetch thread.: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getThread;