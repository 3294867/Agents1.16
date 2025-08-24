import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface Props {
  publicThreadId: string;
  newThreadId: string;
  userId: string;
  agentId: string;
}

const duplicateThread = async (req: Request, res: Response) => {
  const { publicThreadId, newThreadId, userId, agentId }: Props = req.body;

  try {
    const getPublicThread = await utils.controllers.getThread(publicThreadId);
    if (!getPublicThread) return utils.controllers.sendResponse(res, 404, "Failed to get public thread");

    let threadBody = [];
    for (const query of getPublicThread.rows[0].body) {
      const getRequestBody = await pool.query(`SELECT "body" FROM "Request" WHERE "id" = $1::uuid;`, [ query.requestId ]);
      if (!getRequestBody) return utils.controllers.sendResponse(res, 404, "Failed to get requestBody");

      const addRequest = await pool.query(`
        INSERT INTO "Request" (
          "threadId",
          "body"
        )
        SELECT
          $1::uuid,
          $2::text
        Returning *;
      `, [ publicThreadId, getRequestBody.rows[0].body ]);
      if (!addRequest) return utils.controllers.sendResponse(res, 503, "Failed to add request");

      const getResponseBody = await pool.query(`SELECT "body" FROM "Response" WHERE "id" = $1::uuid;`, [ query.responseId ]);
      if (!getResponseBody) return utils.controllers.sendResponse(res, 404, "Failed to get responseBody");

      const addResponse = await pool.query(`
        INSERT INTO "Response" (
          "threadId",
          "body"
        )
        SELECT
          $1::uuid,
          $2::text
        Returning *;
      `, [ publicThreadId, getResponseBody.rows[0].body ]);
      if (!addResponse) return utils.controllers.sendResponse(res, 503, "Failed to add response");

      threadBody.push({ requestId: addRequest.rows[0].id, responseId: addResponse.rows[0].id });
    }

    const duplicateThread = await pool.query(`
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
    `, [
      newThreadId,
      userId,
      agentId,
      getPublicThread.rows[0].title,
      JSON.stringify(threadBody)
    ]);
    if (!duplicateThread) return utils.controllers.sendResponse(res, 503, "Failed to duplicate thread");

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