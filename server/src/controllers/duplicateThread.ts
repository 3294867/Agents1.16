import { Request, Response } from "express";
import { pool } from '..';
import { sendResponse } from '../utils/sendResponse';

interface Props {
  publicThreadId: string;
  newThreadId: string;
  userId: string;
  agentId: string;
}

const duplicateThread = async (req: Request, res: Response) => {
  const { publicThreadId, newThreadId, userId, agentId }: Props = req.body;

  try {
    const getPublicThreadQueryText = `
      SELECT * FROM "Thread" WHERE "id" = $1::uuid;
    `;
    const getPublicThread = await pool.query(getPublicThreadQueryText, [ publicThreadId ]);
    if (!getPublicThread) sendResponse(res, 404, "Failed to get public thread");
    const publicThread = getPublicThread.rows[0];

    let threadBody = [];
    for (const query of publicThread.body) {
      const getRequestBodyQueryText = `
        SELECT "body" FROM "Request" WHERE "id" = $1::uuid;
      `;
      const getRequestBody = await pool.query(getRequestBodyQueryText, [query.requestId]);
      if (!getRequestBody) sendResponse(res, 404, "Failed to get requestBody");
      const requestBody = getRequestBody.rows[0].body;
      
      const addRequestQueryText = `
        INSERT INTO "Request" (
          "threadId",
          "body"
        )
        SELECT
          $1::uuid,
          $2::text
        Returning *;
      `;
      const addRequest = await pool.query(addRequestQueryText, [publicThreadId, requestBody]);
      if (!addRequest) sendResponse(res, 503, "Failed to add request");
      const requestId = addRequest.rows[0].id;

      const getResponseBodyQueryText = `
        SELECT "body" FROM "Response" WHERE "id" = $1::uuid;
      `;
      const getResponseBody = await pool.query(getResponseBodyQueryText, [query.responseId]);
      if (!getResponseBody) sendResponse(res, 404, "Failed to get responseBody");
      const responseBody = getResponseBody.rows[0].body;
      
      const addResponseQueryText = `
        INSERT INTO "Response" (
          "threadId",
          "body"
        )
        SELECT
          $1::uuid,
          $2::text
        Returning *;
      `;
      const addResponse = await pool.query(addResponseQueryText, [publicThreadId, responseBody]);
      if (!addResponse) sendResponse(res, 503, "Failed to add response");
      const responseId = addResponse.rows[0].id;

      threadBody.push({ requestId, responseId });
    }

    const duplicateThreadqueryText = `
      INSERT INTO "Thread" (
        "id",
        "userId",
        "agentId",
        "title",
        "body"
      )
      SELECT
        $1::uuid,
        $2::uuid,
        $3::uuid,
        $4::text,
        $5::jsonb
      RETURNING *;
    `;
    const duplicateThread = await pool.query(duplicateThreadqueryText, [
      newThreadId,
      userId,
      agentId,
      publicThread.title,
      JSON.stringify(threadBody)
    ])
    if (!duplicateThread) return sendResponse(res, 503, "Failed to duplicate thread");

    res.status(200).json({
      message: "Thread duplicated",
      data: duplicateThread.rows[0]
    });

  } catch (error) {
    console.error("Failed to duplicate thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default duplicateThread;