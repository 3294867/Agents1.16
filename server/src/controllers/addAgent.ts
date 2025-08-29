import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';
import { Agent } from '../types';

interface RequestBody {
  agent: Agent;
}

const addAgent = async (req: Request, res: Response): Promise<void> => {
  const { agent }: RequestBody = req.body;

  const validationError = utils.validate.addAgent(agent);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
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
      RETURNING *;
    `, [
      agent.userId,
      agent.workspaceId,
      agent.name,
      agent.type,
      agent.model,
      agent.systemInstructions,
      agent.stack,
      agent.temperature,
      agent.webSearch,
    ]);
    if (insertedAgent.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add agent");

    res.status(201).json({
      message: "Agent added",
      data: { agentName: insertedAgent.rows[0].name }
    });
  } catch (error: any) {
    console.error("Failed to add agent: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addAgent;