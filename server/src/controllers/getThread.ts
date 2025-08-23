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
    const getThread = await pool.query(`SELECT * FROM "Thread" WHERE "id" = $1::uuid;`, [ threadId ]);
    if (!getThread) return sendResponse(res, 404, "Thread not found");

    const adjustedThread: Thread = {
      id: getThread.rows[0].id,
      userId: getThread.rows[0].userId,
      agentId: getThread.rows[0].agentId,
      title: getThread.rows[0].title,
      body: getThread.rows[0].body.map((i: { requestId: string, responseId: string }) => ({
        requestId: i.requestId,
        responseId: i.responseId,
        requestBody: null,
        responseBody: null
      })),
      isBookmarked: getThread.rows[0].isBookmarked,
      createdAt: getThread.rows[0].createdAt,
      updatedAt: getThread.rows[0].updatedAt,
    };

    const bodyWithDetails = await Promise.all(
      adjustedThread.body.map(async (query: Query) => {
        const request = await pool.query(`SELECT "body" FROM "Request" WHERE "id" = $1::uuid`, [ query.requestId ]);
        const response = await pool.query(`SELECT "body" FROM "Response" WHERE "id" = $1::uuid`, [ query.responseId ]);
        return {
          requestId: query.requestId,
          requestBody: request.rows[0].body,
          responseId: query.responseId,
          responseBody: response.rows[0].body,
        };
      })
    );

    getThread.rows[0].body = bodyWithDetails;

    res.status(200).json({
      message: "Thread fetched",
      data: getThread.rows[0]
    });
  } catch (error) {
    console.error("Failed to fetch thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getThread;