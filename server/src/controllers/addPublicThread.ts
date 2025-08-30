import { Request, Response } from "express";
import { pool } from "../index";
import utils from "../utils";
import { QueryPG } from '../types';

interface RequestBody {
  threadId: string;
}

const addPublicThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = await utils.validate.addPublicThread(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);

    /** Get agent type from the thread*/
    const selectedAgentId = await pool.query(`SELECT agent_id FROM agent_thread WHERE thread_id = $1::uuid;`, [ threadId ]);
    if (selectedAgentId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent id");
    }

    const selectedAgentType = await pool.query(`SELECT type FROM agents WHERE id = $1::uuid;`, [ selectedAgentId.rows[0].agent_id ]);
    if (selectedAgentType.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent type");
    }
    
    /** Get root agent id */
    const selectedRootUserId = await pool.query(`SELECT id FROM users WHERE name = 'root';`);
    if (selectedRootUserId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get user id");
    }

    const selectedRootAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid;`, [selectedRootUserId.rows[0].id]);
    if (selectedRootAgentIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent ids");
    }
    const mappedSelectedRootAgentIds = selectedRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const selectedRootAgent = await pool.query(`SELECT id name FROM agents WHERE id = ANY($1::uuid[]) AND type = $2::text;`, [
      mappedSelectedRootAgentIds, selectedAgentType.rows[0].type
    ]);
    if (selectedRootAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent");
    }

    /** Add thread for the root */
    const selectedThread = await pool.query(`SELECT name, body FROM threads WHERE id = $1::uuid;`, [ threadId ] );
    if (selectedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread");
    }

    const insertedRootThread = await pool.query(`INSERT INTO threads (name) VALUES ($1::text) RETURNING id;`, [
      selectedThread.rows[0].name
    ]);
    if (insertedRootThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to add thread");
    }

    /** Add row to agent_thread join table */
    const insertedAgentThread = await pool.query(`INSERT INTO agent_thread (agent_id, thread_id) VALUES ($1::uuid, $2::uuid) RETURNING agent_id;`, [
      selectedRootAgent.rows[0].id, insertedRootThread.rows[0].id
    ]);
    if (insertedAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to add agent_thread");
    }

    /** Add requests and responses for the root*/
    let threadBody: QueryPG[] = [];
    for (const query of selectedThread.rows[0].body) {
      const requestBody = await pool.query(`SELECT body FROM requests WHERE id = $1::uuid;`, [ query.request_id ]);
      if (requestBody.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get request");
      }

      const insertedRootRequest = await pool.query(`INSERT INTO requests (body) VALUES ($1::text) RETURNING id;`, [ requestBody.rows[0].body ]); 
      if (insertedRootRequest.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to add request");
      }

      /** Add row to thread_request join table */
      const insertedThreadRequest = await pool.query(`INSERT INTO thread_request (thread_id, request_id) VALUES ($1::uuid, $2::uuid) RETURNING thread_id;`, [
        insertedRootThread.rows[0].id, insertedRootRequest.rows[0].id
      ]);
      if (insertedThreadRequest.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to add thread_request");
      }

      const responseBody = await pool.query(`SELECT body FROM responses WHERE id = $1::uuid;`, [ query.response_id ]);
      if (responseBody.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get response");
      }

      const insertedRootResponse = await pool.query(`INSERT INTO responses (body) VALUES ($1::text) RETURNING id;`, [ responseBody.rows[0].body ]);
      if (insertedRootResponse.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to add response");
      }

      /** Add row to thread_response join table */
      const insertedThreadResponse = await pool.query(`INSERT INTO thread_response (thread_id, response_id) VALUES ($1::uuid, $2::uuid) RETURNING thread_id;`, [
        insertedRootThread.rows[0].id, insertedRootResponse.rows[0].id
      ]);
      if (insertedThreadResponse.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to add thread_response");
      }

      threadBody.push({ request_id: insertedRootRequest.rows[0].id, response_id: insertedRootResponse.rows[0].id });
    }

    /** Update thread for the root */
    const updatedRootThread = await pool.query(`UPDATE threads SET body = $1::jsonb WHERE id = $2::uuid RETURNIG id;`, [ JSON.stringify(threadBody), insertedRootThread.rows[0].id ]);
    if (updatedRootThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to update thread");
    }

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: "Public thread added",
      data: {
        agentName: selectedAgentType.rows[0].name,
        threadId: insertedRootThread.rows[0].id,
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
