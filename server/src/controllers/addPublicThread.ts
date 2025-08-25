import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  threadId: string;
}

const addPublicThread = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    await pool.query("BEGIN");

    const getThread = await utils.getThread(threadId);
    if (getThread.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get thread");
    
    const getAgentType = await pool.query(`SELECT "type" FROM "Agent" WHERE "id" = $1::uuid;`, [ getThread.rows[0].agentId ]);
    if (getAgentType.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch agent type"); 
    
    const getRootUserId = await utils.getRootUserId();
    if (getRootUserId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get root user");
    
    const getAgentId = await pool.query(`SELECT "id" FROM "Agent" WHERE "userId" = $1::uuid AND "type" = $2::text;`, [
      getRootUserId.rows[0].id, getAgentType.rows[0].type
    ]);
    if (getAgentId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get general agent id");
    
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
      RETURNING "id";
    `, [
      getRootUserId.rows[0].id,
      getAgentId.rows[0].id,
      getThread.rows[0].title,
    ]);
    if (addPublicThread.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add public thread");
    
    let threadBody = [];
    for (const query of getThread.rows[0].body) {
      const getRequestBody = await pool.query(`SELECT "body" FROM "Request" WHERE "id" = $1::uuid;`, [ query.requestId ]);
      if (getRequestBody.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get requestBody");

      const addRequest = await pool.query(`
        INSERT INTO "Request" (
          "threadId", "body"
        )
        SELECT
          $1::uuid, $2::text
        RETURNING "id";
      `, [ addPublicThread.rows[0].id, getRequestBody.rows[0].body ]);
      if (addRequest.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add request");

      const getResponseBody = await pool.query(`SELECT "body" FROM "Response" WHERE "id" = $1::uuid;`, [ query.responseId ]);
      if (getResponseBody.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get responseBody");

      const addResponse = await pool.query(`
        INSERT INTO "Response" (
          "threadId", "body"
        )
        SELECT
          $1::uuid, $2::text
        RETURNING "id";
      `, [ addPublicThread.rows[0].id, getResponseBody.rows[0].body ]);
      if (addResponse.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add response");

      threadBody.push({ requestId: addRequest.rows[0].id, responseId: addResponse.rows[0].id });
    }

    const updateThreadBody = await pool.query(`UPDATE "Thread" SET "body" = $1::jsonb WHERE "id" = $2::uuid RETURNING "id";`, [
      JSON.stringify(threadBody), addPublicThread.rows[0].id
    ]);
    if (updateThreadBody.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update thread body");
    
    await pool.query("COMMIT");

    res.status(200).json({
      message: "Public thread added",
      data: {
        agentType: getAgentType.rows[0].type,
        threadId: addPublicThread.rows[0].id
      }
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