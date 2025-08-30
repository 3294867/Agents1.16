import { Request, Response } from "express";
import { pool } from "../index";
import bcrypt from "bcrypt";
import utils from '../utils';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

interface RequestBody {
  name: string;
  password: string;
  apiKey: string;
}

const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, password, apiKey }: RequestBody = req.body;

  const validationError = utils.validate.signup(name, password, apiKey);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`); 

    const selectedExistingUser = await pool.query(`SELECT id FROM users WHERE name = $1::text;`, [ name ]);
    if (selectedExistingUser.rows.length === 1) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 409, "User exists");
    }
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /** User */
    const insertedUser = await pool.query(`
      INSERT INTO users (name, password, apiKey)
      VALUES ($1::text, $2::text, $3::text)
      RETURNING id;
    `, [ name, hashedPassword, apiKey ]);
    if (insertedUser.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add user");
    }

    /** Personal Workspace */
    const insertedWorkspace = await pool.query(`INSERT INTO workspaces (name, description) VALUES ('personal', 'Personal workspace') RETURNING id;`);
    if (insertedWorkspace.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add workspace");
    }

    const insertedWorkspaceUser =  await pool.query(`INSERT INTO workspace_user (workspace_id, user_id) VALUES ($1::uuid, $2::uuid) RETURNING workspace_id;`, [
      insertedWorkspace.rows[0].id, insertedUser.rows[0].id
    ]);
    if (insertedWorkspaceUser.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add workspace_user");
    }

    /** General Agent */
    const selectedRootUserId = await pool.query(`SELECT id FROM users WHERE name = 'root';`);
    if (selectedRootUserId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to fetch root user id");
    }

    const selectedRootAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid;`, [
      selectedRootUserId.rows[0].id
    ]);
    if (selectedRootAgentIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to fetch root agents ids");
    }
    const mappedSelectedRootAgentIds = selectedRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
    
    const selectedRootGeneralAgent = await pool.query(`
      SELECT name, type, model, system_instructions, stack, temperature, web_search
      FROM agents WHERE id = ANY($1::uuid[]) AND name = 'general_assistant';
    `, [ mappedSelectedRootAgentIds ]);
    if (selectedRootGeneralAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to fetch agent data");
    }
    
    const insertedGeneralAgent = await pool.query(`
      INSERT INTO agents (
        name,
        type,
        model,
        system_instructions,
        stack,
        temperature,
        web_search
      )
      SELECT
        $1::text,
        $2::text,
        $3::varchar(20),
        $4::text,
        $5::text[],
        $6::float,
        $7::boolean
      RETURNING id;
    `, [
      selectedRootGeneralAgent.rows[0].name,
      selectedRootGeneralAgent.rows[0].type,
      selectedRootGeneralAgent.rows[0].model,
      selectedRootGeneralAgent.rows[0].system_instructions,
      selectedRootGeneralAgent.rows[0].stack,
      selectedRootGeneralAgent.rows[0].temperature,
      selectedRootGeneralAgent.rows[0].web_search,

    ]);
    if (insertedGeneralAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add general agent");
    }

    const insertedUserAgent = await pool.query(`INSERT INTO user_agent (user_id, agent_id) VALUES ($1::uuid, $2::uuid) RETURNING user_id;`, [
      insertedUser.rows[0].id, insertedGeneralAgent.rows[0].id
    ]);
    if (insertedUserAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add agent");
    }
    
    await pool.query(`COMMIT`);

    req.session.userId = insertedUser.rows[0].id;
    res.json({ success: true, userId: insertedUser.rows[0].id })

  } catch (error: any) {
    try {
      await pool.query(`ROLLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || error);
    }
    console.error("Failed to create user: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default signUp;