import { Request, Response } from "express";
import { pool } from "../index";
import utils from "../utils";

interface RequestBody {
  threadId: string;
}

const addPublicThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = await utils.validate.addPublicThread(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);

    const selectedThread = await utils.selectedThread(threadId);
    if (selectedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread");
    }

    const selectedAgentType = await pool.query(`SELECT type FROM agents WHERE id = $1::uuid;`, [
      selectedThread.rows[0].agent_id
    ]);
    if (selectedAgentType.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent type");
    }

    const selectedRootUserId = await utils.selectedRootUserId();
    if (selectedRootUserId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get root user id");
    }

    const selectedAgentId = await pool.query(`SELECT id FROM agents WHERE user_id = $1::uuid AND type = $2::text;`, [
      selectedRootUserId.rows[0].id, selectedAgentType.rows[0].type
    ]);
    if (selectedAgentId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get general agent id");
    }

    const insertedPublicThread = await pool.query(`
      INSERT INTO threads (user_id, agent_id, title)
      VALUES ($1::uuid, $2::uuid, $3::text)
      RETURNING id;
    `, [ selectedRootUserId.rows[0].id, selectedAgentId.rows[0].id, selectedThread.rows[0].title ]
    );
    if (insertedPublicThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add public thread");
    }

    if (selectedThread.rows[0].body.length > 0) {
      const requestIds = selectedThread.rows[0].body.map((q: { request_id: string, response_id: string }) => q.request_id);
      const responseIds = selectedThread.rows[0].body.map((q: { request_id: string, response_id: string }) => q.response_id);
  
      const selectedRequests = await pool.query(`SELECT id, body FROM requests WHERE id = ANY($1::uuid[])`, [
        requestIds
      ]);
      if (selectedRequests.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get requests");
      }
      const requestLookup: Record<string, string> = {};
      for (const row of selectedRequests.rows) requestLookup[row.id] = row.body;
  
      const selectedResponses = await pool.query(`SELECT id, body FROM responses WHERE id = ANY($1::uuid[])`, [
        responseIds
      ]);
      if (selectedResponses.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get responses");
      }
      const responseLookup: Record<string, string> = {};
      for (const row of selectedResponses.rows) responseLookup[row.id] = row.body;
  
      const newThreadBody: { request_id: string, response_id: string }[] = [];
      for (let i = 0; i < selectedThread.rows[0].body.length; i++) {
        const requestId = requestIds[i];
        const responseId = responseIds[i];
  
        const insertedRequest = await pool.query(`INSERT INTO requests (thread_id, body) VALUES ($1::uuid, $2::text) RETURNING id;`, [
          insertedPublicThread.rows[0].id, requestLookup[requestId]
        ]);
        if (insertedRequest.rows.length === 0) {
          await pool.query(`ROLLBACK`);
          return utils.sendResponse(res, 503, "Failed to add request");
        }
  
        const insertedResponse = await pool.query(`INSERT INTO responses (thread_id, body) VALUES ($1::uuid, $2::text) RETURNING id;`, [
          insertedPublicThread.rows[0].id, responseLookup[responseId]
        ]);
        if (insertedResponse.rows.length === 0) {
          await pool.query(`ROLLBACK`);
          return utils.sendResponse(res, 503, "Failed to add response");
        }
  
        newThreadBody.push({
          request_id: insertedRequest.rows[0].id,
          response_id: insertedResponse.rows[0].id,
        });
      }
  
      const updatedThread = await pool.query(`UPDATE threads SET body = $1::jsonb WHERE id = $2::uuid RETURNING id;`, [
        JSON.stringify(newThreadBody), insertedPublicThread.rows[0].id
      ]);
      if (updatedThread.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 503, "Failed to update thread body");
      }
    }

    await pool.query(`COMMIT`);

    res.status(200).json({
      message: "Public thread added",
      data: {
        agentType: selectedAgentType.rows[0].type,
        threadId: insertedPublicThread.rows[0].id,
      },
    });
  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || rollbackError);
    }
    console.error("Failed to add public thread: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addPublicThread;
