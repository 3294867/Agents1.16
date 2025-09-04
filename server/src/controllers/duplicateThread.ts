import { Request, Response } from "express";
import { pool } from '../..';
import utils from '../utils';

interface RequestBody {
  userId: string;
  workspaceId: string;
  publicThreadId: string;
}

const duplicateThread = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceId, publicThreadId }: RequestBody = req.body;

  const validationError = await utils.validate.duplicateThread(userId, workspaceId, publicThreadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);

    /** Get agent type from the root */
    const getRootAgentId = await pool.query(`
      SELECT agent_id
      FROM agent_thread
      WHERE thread_id = $1::uuid;
    `, [ publicThreadId ]);
    if (getRootAgentId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get root agent id");
    }

    const getRootAgentType = await pool.query(`
      SELECT type
      FROM agents
      WHERE id = $1::uuid;
    `, [ getRootAgentId.rows[0].agent_id ]);
    if (getRootAgentType.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent type");
    }

    /** Get agent id from the user */
    let agentId: string;
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ userId ]);
    if (getAgentIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get user agent");
    }
    const agentIds: string[] = getAgentIds.rows.map((i: { agent_id: string}) => i.agent_id);
    
    const getAgentId = await pool.query(`
      SELECT id
      FROM agents
      WHERE id = ANY($1::uuid[]) AND type = $2::text;
    `, [ agentIds, getRootAgentType.rows[0].type ]);

    /** Use existing agent id, if agent exists */
    if (getAgentId.rows.length === 1) {
      agentId = getAgentId.rows[0].id;
    /** Insert new agent, if does not exist */
    } else {
      const getRootUserId = await pool.query(`
        SELECT id
        FROM users
        WHERE name = 'root'::text;
      `);
      if (getRootUserId.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get root user id");
      }
        
      const getRootAgentIds = await pool.query(`
        SELECT agent_id
        FROM user_agent
        WHERE user_id = $1::uuid;
      `, [ getRootUserId.rows[0].id ]); 
      if (getRootAgentIds.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get user agent");
      }
      const rootAgentIds: string[] = getRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
      
      const getRootAgent = await pool.query(`
        SELECT name, type, model, system_instructions, stack, temperature, web_search
        FROM agents
        WHERE id = ANY($1::uuid[]) AND type = $2::text;
      `, [ rootAgentIds, getRootAgentType.rows[0].type ]);
      if (getRootAgent.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get agent id");
      }
      
      const addAgent = await pool.query(`
        INSERT INTO agents (
          name,
          type,
          model,
          system_instructions,
          stack,
          temperature,
          web_search
        )
        VALUES (
          $1::text,
          $2::text,
          $3::varchar(20),
          $4::text,
          $5::text[],
          $6::float,
          $7::boolean
        )
        RETURNING id;
      `, [
        getRootAgent.rows[0].name,
        getRootAgent.rows[0].type,
        getRootAgent.rows[0].model,
        getRootAgent.rows[0].system_instructions,
        getRootAgent.rows[0].stack,
        getRootAgent.rows[0].temperature,
        getRootAgent.rows[0].web_search
      ]);
      if (addAgent.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 503, "Failed to add agent");
      }

      /** Assign new agent id */
      agentId = addAgent.rows[0].id;
    }

    /** Duplicate thread */
    const getPublicThread = await pool.query(`
      SELECT name, body
      FROM threads
      WHERE id = $1::uuid;
    `, [ publicThreadId ]);
    if (getPublicThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get public thread");
    }

    const duplicateThread = await pool.query(`
      INSERT INTO threads (
        name,
        body,
        is_shared
      )
      VALUES (
        $1::text,
        $2::jsonb,
        TRUE
      )
      RETURNING id;
    `, [
      getPublicThread.rows[0].name,
      getPublicThread.rows[0].body,
    ]);
    if (duplicateThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to duplicate thread");
    }

    /** Add row into agent_thread join table */
    const addAgentThread = await pool.query(`
      INSERT INTO agent_thread (agent_id, thread_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING agent_id;
    `, [ agentId, duplicateThread.rows[0].id ]);
    if (addAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add agent thread");
    }
    
    await pool.query(`COMMIT`);

    res.status(200).json({
      message: "Thread duplicated",
      data: duplicateThread.rows[0].id
    });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to duplicate thread: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default duplicateThread;