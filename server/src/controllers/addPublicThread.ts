import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  threadId: string;
}

const addPublicThread = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    await pool.query("BEGIN");

    const getThreadQueryText = `
      SELECT * FROM "Thread" WHERE "id" = $1::uuid;
    `;
    const getThread = await pool.query(getThreadQueryText, [ threadId ]);
    if (!getThread) sendResponse(res, 404, "Failed to get thread");
    const thread = getThread.rows[0];
    
    const getRootUserQueryText = `
      SELECT "id" FROM "User" WHERE "name" = 'Root'::text;
    `;
    const getRootUser = await pool.query(getRootUserQueryText);
    if (!getRootUser) sendResponse(res, 404, "Failed to get root user");
    const rootUserId = getRootUser.rows[0].id;
    
    const getGeneralAgentIdQueryText = `
      SELECT "id" FROM "Agent"
      WHERE "userId" = $1::uuid
        AND "type" = 'general'::text;
    `;
    const getGeneralAgentId = await pool.query(getGeneralAgentIdQueryText, [
      rootUserId
    ]);
    if (!getGeneralAgentId) sendResponse(res, 404, "Failed to get general agent id");
    const generalAgentId = getGeneralAgentId.rows[0].id;
    
    const addPublicThreadQueryText = `
      INSERT INTO "Thread" (
        "userId",
        "agentId",
        "title",
        "body"
      )
      SELECT
        $1::uuid,
        $2::uuid,
        $3::text,
        '{}'::jsonb
      RETURNING *;
    `;
    const addPublicThread = await pool.query(addPublicThreadQueryText, [
      rootUserId,
      generalAgentId,
      thread.title,
    ]);
    if (!addPublicThread) sendResponse(res, 503, "Failed to add public thread");
    const publicThreadId: string = addPublicThread.rows[0].id;
    
    let threadBody = [];
    for (const query of thread.body) {
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

    const updateThreadBodyQueryText = `
      UPDATE "Thread"
      SET "body" = $1::jsonb
      WHERE "id" = $2::uuid;
    `;
    const updateThreadBody = await pool.query(updateThreadBodyQueryText, [
      JSON.stringify(threadBody),
      publicThreadId
    ]);
    if (!updateThreadBody) sendResponse(res, 503, "Failed to update thread body");
    
    await pool.query("COMMIT");

    res.status(200).json({
      message: "Public thread added",
      data: publicThreadId
    });

  } catch (error) {
    try {
      await pool.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to add public thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addPublicThread;