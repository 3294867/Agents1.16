import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';
import { AddAgent } from '../types';

interface RequestBody {
  workspaceId: string;
  agentData: AddAgent;
}

const addAgent = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId, agentData }: RequestBody = req.body;

  const validationError = utils.validate.addAgent(workspaceId, agentData);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);

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
      agentData.name,
      agentData.type,
      agentData.model,
      agentData.systemInstructions,
      agentData.stack,
      agentData.temperature,
      agentData.webSearch,
    ]);
    if (addAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add agent");
    }

    const addWorkspaceAgent = await pool.query(`
      INSERT INTO workspace_agent (workspace_id, agent_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING workspace_id;
    `,[ workspaceId, addAgent.rows[0].id ]);
    if (addWorkspaceAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add workspace agent");
    }

    const getWorkspaceUserIds = await pool.query(`
      SELECT user_id
      FROM workspace_user
      WHERE workspace_id = $1::uuid;
    `, [ workspaceId ]);
    if (getWorkspaceUserIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get workspace user ids");
    }
    const userIds = getWorkspaceUserIds.rows.map((i: { user_id: string }) => i.user_id);

    for (const item of userIds) {
      const addUserAgent = await pool.query(`
        INSERT INTO user_agent (user_id, agent_id)
        VALUES ($1::uuid, $2::uuid)
        RETURNING agent_id;
      `, [ item, addAgent.rows[0].id ]);
      if (addUserAgent.rows.length === 0) {
        await pool.query(`ROLLBACK`);
        return utils.sendResponse(res, 404, "Failed to add user agent");
      }
    }
    
    await pool.query(`COMMIT`);

    utils.sendResponse(res, 201, "Agent added");
  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error('Rollback error: ', rollbackError.stack || error);
    }
    console.error("Failed to add agent: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addAgent;