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
    const selectedRootAgentId = await pool.query(`SELECT agent_id FROM agent_thread WHERE thread_id = $1::uuid`, [ publicThreadId ]);
    if (selectedRootAgentId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent thread");
    }

    const selectedRootAgentType = await pool.query(`SELECT type FROM agents WHERE id = $1::uuid;`, [
      selectedRootAgentId.rows[0].agent_id
    ]);
    if (selectedRootAgentType.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent type");
    }

    /** Get agent id from the user */
    let agentId: string;
    const selectedAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid;`, [ userId ]);
    if (selectedAgentIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get user agent");
    }
    const mappedSelectedAgentIds = selectedAgentIds.rows.map((i: { agent_id: string}) => i.agent_id);
    
    const selectedAgentId = await pool.query(`SELECT id FROM agents WHERE id = ANY($1::uuid[]) AND type = $2::text;`, [
      mappedSelectedAgentIds, selectedRootAgentType.rows[0].type
    ]);

    /** Use existing agent id, if agent exists */
    if (selectedAgentId.rows.length === 1) {
      agentId = selectedAgentId.rows[0].id;
    /** Insert new agent, if does not exist */
    } else {
      const selectedRootUserId = await pool.query(`SELECT id FROM users WHERE name = 'root'::text;`);
      if (selectedRootUserId.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get root user id");
      }
        
      const selectedRootAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid;`, [ selectedRootUserId.rows[0].id ]); 
      if (selectedRootAgentIds.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get user agent");
      }
      const mappedSelectedRootAgentIds = selectedRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
      
      const selectedRootAgent = await pool.query(`
        SELECT name, type, model, system_instructions, stack, temperature, web_search
        FROM agents WHERE id = ANY($1::uuid[]) AND type = $2::text;
      `, [ mappedSelectedRootAgentIds, selectedRootAgentType.rows[0].type ]);
      if (selectedRootAgent.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get agent id");
      }
      
      const insertedAgent = await pool.query(`
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
      `,[
        selectedRootAgent.rows[0].name,
        selectedRootAgent.rows[0].type,
        selectedRootAgent.rows[0].model,
        selectedRootAgent.rows[0].system_instructions,
        selectedRootAgent.rows[0].stack,
        selectedRootAgent.rows[0].temperature,
        selectedRootAgent.rows[0].web_search
      ]);
      if (insertedAgent.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 503, "Failed to add agent");
      }

      /** Assign new agent id */
      agentId = insertedAgent.rows[0].id;
    }

    /** Duplicate thread */
    const selectedPublicThread = await pool.query(`SELECT name, body FROM threads WHERE id = $1::uuid`, [ publicThreadId ]);
    if (selectedPublicThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get public thread");
    }

    const duplicatedThread = await pool.query(`
      INSERT INTO threads (
        name,
        body,
        is_shared
      )
      VALUES (
        $3::text,
        $4::jsonb,
        TRUE
      )
      RETURNING id;
    `, [
      selectedPublicThread.rows[0].name,
      selectedPublicThread.rows[0].body,
    ]);
    if (duplicatedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to duplicate thread");
    }

    /** Add row into agent_thread join table */
    const insertedAgentThread = await pool.query(`
      INSERT INTO agent_thread (agent_id, thread_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING agent_id;
    `, [ agentId, duplicatedThread.rows[0].id ]);
    if (insertedAgentThread.rows[0].length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add agent thread");
    }
    
    await pool.query(`COMMIT`);

    res.status(200).json({
      message: "Thread duplicated",
      data: { threadId: duplicatedThread.rows[0].id }
    });

  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || rollbackError);
    }
    console.error("Failed to duplicate thread: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default duplicateThread;