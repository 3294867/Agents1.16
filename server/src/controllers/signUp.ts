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

  const validationError = utils.validate.signup({ name, password, apiKey });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    await pool.query(`BEGIN`); 

    const getExistingUser = await pool.query(`
      SELECT id
      FROM users
      WHERE name = $1::text;
    `, [ name ]);
    if (getExistingUser.rows.length === 1) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 409, message: "User exists" });
    }
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /** User */
    const addUser = await pool.query(`
      INSERT INTO users (name, password, api_key)
      VALUES ($1::text, $2::text, $3::text)
      RETURNING id;
    `, [ name, hashedPassword, apiKey ]);
    if (addUser.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add user" });
    }

    /** Workspace */
    const addWorkspace = await pool.query(`
      INSERT INTO workspaces (name, description)
      VALUES ('personal', 'Personal workspace')
      RETURNING id;
    `);
    if (addWorkspace.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add workspace" });
    }

    const addWorkspaceUser = await pool.query(`
      INSERT INTO workspace_user (workspace_id, user_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING workspace_id;
    `, [ addWorkspace.rows[0].id, addUser.rows[0].id ]);
    if (addWorkspaceUser.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add workspace user" });
    }

    /** Agent */
    const getRootUserId = await pool.query(`
      SELECT id
      FROM users
      WHERE name = 'root'::text;
    `);
    if (getRootUserId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to fetch root user id" });
    }

    const getRootAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ getRootUserId.rows[0].id ]);
    if (getRootAgentIds.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to fetch root agents ids" });
    }
    const rootAgentIds: string[] = getRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
    
    const getRootGeneralAgent = await pool.query(`
      SELECT name, type, model, system_instructions, stack, temperature, web_search
      FROM agents
      WHERE id = ANY($1::uuid[]) AND name = 'general'::text;
    `, [ rootAgentIds ]);
    if (getRootGeneralAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to fetch agent data" });
    }
    
    const addGeneralAgent = await pool.query(`
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
      getRootGeneralAgent.rows[0].name,
      getRootGeneralAgent.rows[0].type,
      getRootGeneralAgent.rows[0].model,
      getRootGeneralAgent.rows[0].system_instructions,
      getRootGeneralAgent.rows[0].stack,
      getRootGeneralAgent.rows[0].temperature,
      getRootGeneralAgent.rows[0].web_search,
    ]);
    if (addGeneralAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add general agent" });
    }

    const addUserAgent = await pool.query(`
      INSERT INTO user_agent (user_id, agent_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING user_id;
    `, [ addUser.rows[0].id, addGeneralAgent.rows[0].id ]);
    if (addUserAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add user agent" });
    }

    const addWorkspaceAgent = await pool.query(`
      INSERT INTO workspace_agent (workspace_id, agent_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING workspace_id;
    `, [ addWorkspace.rows[0].id, addGeneralAgent.rows[0].id ]);
    if (addWorkspaceAgent.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add workspace agent" });
    }
    
    await pool.query(`COMMIT`);

    req.session.userId = addUser.rows[0].id;
    res.json({ success: true, userId: addUser.rows[0].id });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to create user: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default signUp;