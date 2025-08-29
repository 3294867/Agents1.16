import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  publicThreadId: string;
  userId: string;
  workspaceId: string;
}

const duplicateThread = async (req: Request, res: Response): Promise<void> => {
  const { publicThreadId, userId, workspaceId }: RequestBody = req.body;

  const validationError = await utils.validate.duplicateThread(publicThreadId, userId, workspaceId );
  if (validationError) return utils.sendResponse(res, 404, validationError);

  try {
    await pool.query(`BEGIN`);
    
    const selectedPublicThread = await utils.selectedThread(publicThreadId);
    if (selectedPublicThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get public thread");
    }

    const selectedAgentType = await pool.query(`SELECT type FROM agents WHERE id = $1::uuid;`, [
      selectedPublicThread.rows[0].agent_id
    ]);
    if (selectedAgentType.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get agent type");
    }
    
    let agentId: string;
    const selectedAgentId = await pool.query(`SELECT id FROM agents WHERE user_id = $1::uuid AND type = $2::text;`, [
      userId, selectedAgentType.rows[0].type
    ]);

    if (selectedAgentId.rows.length === 1) {
      agentId = selectedAgentId.rows[0].id;
    } else {
      const selectedRootUserId = await utils.selectedRootUserId();
      if (selectedRootUserId.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get root user id");
      }
        
      const selectedRootAgent = await pool.query(`SELECT * FROM agents WHERE user_id = $1::uuid AND type = $2::text`, [
        selectedRootUserId.rows[0].id, selectedAgentType.rows[0].type
      ]);
      if (selectedRootAgent.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to get root agent");
      }

      const insertedAgent = await pool.query(`
        INSERT INTO agents (
          user_id,
          workspace_id,
          name,
          type,
          model,
          system_instructions,
          stack,
          temperature,
          web_search
        )
        VALUES (
          $1::uuid,
          $2::uuid,
          $3::text,
          $4::text,
          $5::varchar(20),
          $6::text,
          $7::text[],
          $8::float,
          $9::boolean
        )
        RETURNING id;
      `,[
        userId,
        workspaceId,
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
      
      agentId = insertedAgent.rows[0].id;
    }

    const duplicatedThread = await pool.query(`
      INSERT INTO threads (
        user_id,
        agent_id,
        title,
        body,
        is_shared
      )
      VALUES (
        $1::uuid,
        $2::uuid,
        $3::text,
        $4::jsonb,
        TRUE::
      )
      RETURNING id;
    `, [
      userId,
      agentId,
      selectedPublicThread.rows[0].title,
      selectedPublicThread.rows[0].body,
    ]);
    if (duplicatedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to duplicate thread");
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