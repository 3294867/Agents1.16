import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  userId: string;
  workspaceId: string;
  rootAgentId: string;
}

const addAgent = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceId, rootAgentId }: RequestBody = req.body;

  const validationError = utils.validate.addAgent(userId, workspaceId, rootAgentId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);

    /** Get agent from the root */
    const getRootAgent = await pool.query(`
      SELECT name, type, model, system_instructions, stack, temperature, web_search
      FROM agents WHERE id = $1::uuid;
    `, [ rootAgentId ]);
    if (getRootAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get root agent");
    }

    /** Add agent for the user */
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
      getRootAgent.rows[0].web_search,
    ]);
    if (addAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add agent");
    }

    /** Add row to workspace_agent join table */
    const addWorkspaceAgent = await pool.query(`
      INSERT INTO workspace_agent (workspace_id, agent_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING workspace_id;
    `,[ workspaceId, addAgent.rows[0].id ]);
    if (addWorkspaceAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add workspace agent");
    }

    /** Add row to user_agent join table */
    const addUserAgent = await pool.query(`
      INSERT INTO user_agent (user_id, agent_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING user_id;
    `, [ userId, addAgent.rows[0].id ]);
    if (addUserAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add user agent");
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