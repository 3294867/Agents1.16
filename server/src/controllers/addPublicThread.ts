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

    const getThread = await pool.query(`SELECT * FROM "Thread" WHERE "id" = $1::uuid;`, [ threadId ]);
    if (!getThread) sendResponse(res, 404, "Failed to get thread");
    
    const getRootUser = await pool.query(`SELECT "id" FROM "User" WHERE "name" = 'Root'::text;`);
    if (!getRootUser) sendResponse(res, 404, "Failed to get root user");
    
    const getGeneralAgentId = await pool.query(`
      SELECT "id" FROM "Agent" WHERE "userId" = $1::uuid
        AND "type" = 'general'::text;
    `, [ getRootUser.rows[0].id ]);
    if (!getGeneralAgentId) sendResponse(res, 404, "Failed to get general agent id");
    
    const addPublicThread = await pool.query(`
      INSERT INTO "Thread" (
        "userId",
        "agentId",
        "title"
      )
      SELECT
        $1::uuid,
        $2::uuid,
        $3::text
      RETURNING *;
    `, [
      getRootUser.rows[0].id,
      getGeneralAgentId.rows[0].id,
      getThread.rows[0].title,
    ]);
    if (!addPublicThread) sendResponse(res, 503, "Failed to add public thread");
    
    let threadBody = [];
    for (const query of getThread.rows[0].body) {
      const getRequestBody = await pool.query(`SELECT "body" FROM "Request" WHERE "id" = $1::uuid;`, [ query.requestId ]);
      if (!getRequestBody) sendResponse(res, 404, "Failed to get requestBody");

      const addRequest = await pool.query(`
        INSERT INTO "Request" (
          "threadId", "body"
        )
        SELECT
          $1::uuid, $2::text
        Returning *;
      `, [ addPublicThread.rows[0].id, getRequestBody.rows[0].body ]);
      if (!addRequest) sendResponse(res, 503, "Failed to add request");

      const getResponseBody = await pool.query(`SELECT "body" FROM "Response" WHERE "id" = $1::uuid;`, [ query.responseId ]);
      if (!getResponseBody) sendResponse(res, 404, "Failed to get responseBody");

      const addResponse = await pool.query(`
        INSERT INTO "Response" (
          "threadId", "body"
        )
        SELECT
          $1::uuid, $2::text
        Returning *;
      `, [ addPublicThread.rows[0].id, getResponseBody.rows[0].body ]);
      if (!addResponse) sendResponse(res, 503, "Failed to add response");

      threadBody.push({ requestId: addRequest.rows[0].id, responseId: addResponse.rows[0].id });
    }

    const updateThreadBody = await pool.query(`UPDATE "Thread" SET "body" = $1::jsonb WHERE "id" = $2::uuid;`, [
      JSON.stringify(threadBody), addPublicThread.rows[0].id
    ]);
    if (!updateThreadBody) sendResponse(res, 503, "Failed to update thread body");
    
    await pool.query("COMMIT");

    res.status(200).json({
      message: "Public thread added",
      data: addPublicThread.rows[0].id
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