import { Request, Response } from "express";
import { pool } from "../index";
import utils from "../utils";
import { ReqResPG } from '../types';

interface RequestBody {
  threadId: string;
}

const addPublicThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = await utils.validate.addPublicThread({ threadId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    await pool.query(`BEGIN`);

    /** Get agent type from the thread*/
    const getAgentId = await pool.query(`
      SELECT agent_id
      FROM agent_thread
      WHERE thread_id = $1::uuid;
    `, [ threadId ]);
    if (getAgentId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get agent id" });
    }

    const getAgentType = await pool.query(`
      SELECT type
      FROM agents
      WHERE id = $1::uuid;
    `, [ getAgentId.rows[0].agent_id ]);
    if (getAgentType.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get agent type" });
    }
    
    /** Get root agent id */
    const getRootUserId = await pool.query(`
      SELECT id
      FROM users
      WHERE name = 'root'::text;
    `);
    if (getRootUserId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get root user id" });
    }

    const getRootAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ getRootUserId.rows[0].id ]);
    if (getRootAgentIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get agent ids" });
    }
    const rootAgentIds: string[] = getRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getRootAgent = await pool.query(`
      SELECT id
      FROM agents
      WHERE id = ANY($1::uuid[]) AND type = $2::text;
    `, [ rootAgentIds, getAgentType.rows[0].type ]);
    if (getRootAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get agent" });
    }

    /** Add thread for the root */
    const getThread = await pool.query(`
      SELECT name, body
      FROM threads
      WHERE id = $1::uuid;
    `, [ threadId ] );
    if (getThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get thread" });
    }

    const addRootThread = await pool.query(`
      INSERT INTO threads (name)
      VALUES ($1::text)
      RETURNING id;
    `, [ getThread.rows[0].name ]);
    if (addRootThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to add root thread" });
    }

    /** Add row to agent_thread join table */
    const addAgentThread = await pool.query(`
      INSERT INTO agent_thread (agent_id, thread_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING agent_id;
    `, [ getRootAgent.rows[0].id, addRootThread.rows[0].id ]);
    if (addAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add agent thread" });
    }

    /** Add requests and responses for the root*/
    let threadBody: ReqResPG[] = [];
    for (const item of getThread.rows[0].body) {
      const getRequestBody = await pool.query(`
        SELECT body
        FROM requests
        WHERE id = $1::uuid;
      `, [ item.request_id ]);
      if (getRequestBody.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse({ res, status: 404, message: "Failed to get request" });
      }

      const addRootRequest = await pool.query(`
        INSERT INTO requests (body)
        VALUES ($1::text)
        RETURNING id;
      `, [ getRequestBody.rows[0].body ]); 
      if (addRootRequest.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse({ res, status: 503, message: "Failed to add request" });
      }

      /** Add row to thread_request join table */
      const addThreadRequest = await pool.query(`
        INSERT INTO thread_request (thread_id, request_id)
        VALUES ($1::uuid, $2::uuid)
        RETURNING thread_id;
      `, [ addRootThread.rows[0].id, addRootRequest.rows[0].id ]);
      if (addThreadRequest.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse({ res, status: 503, message: "Failed to add thread request" });
      }

      const getResponseBody = await pool.query(`
        SELECT body
        FROM responses
        WHERE id = $1::uuid;
      `, [ item.response_id ]);
      if (getResponseBody.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse({ res, status: 404, message: "Failed to get response" });
      }

      const addRootResponse = await pool.query(`
        INSERT INTO responses (body)
        VALUES ($1::text)
        RETURNING id;
      `, [ getResponseBody.rows[0].body ]);
      if (addRootResponse.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse({ res, status: 503, message: "Failed to add response" });
      }

      /** Add row to thread_response join table */
      const addThreadResponse = await pool.query(`
        INSERT INTO thread_response (thread_id, response_id)
        VALUES ($1::uuid, $2::uuid)
        RETURNING thread_id;
      `, [ addRootThread.rows[0].id, addRootResponse.rows[0].id ]);
      if (addThreadResponse.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse({ res, status: 503, message: "Failed to add thread response" });
      }

      threadBody.push({ request_id: addRootRequest.rows[0].id, response_id: addRootResponse.rows[0].id });
    }

    /** Update thread for the root */
    const updateRootThread = await pool.query(`
      UPDATE threads
      SET body = $1::jsonb
      WHERE id = $2::uuid
      RETURNING id;
    `, [ JSON.stringify(threadBody), addRootThread.rows[0].id ]);
    if (updateRootThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to update thread" });
    }

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: "Public thread added",
      data: {
        agentType: getAgentType.rows[0].type,
        threadId: addRootThread.rows[0].id
      },
    });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to add public thread: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default addPublicThread;
