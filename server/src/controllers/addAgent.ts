import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';
import { Agent } from '../types';

interface RequestBody {
  agent: Agent;
}

const addAgent = async (req: Request, res: Response) => {
  const { agent }: RequestBody = req.body;

  const error = utils.validate.addAgent(agent);
  if (error) return utils.sendResponse(res, 400, error);

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
      agent.type ?? 'general',
      agent.model ?? 'gpt-3.5-turbo',
      agent.systemInstructions ?? null,
      agent.stack ?? null,
      agent.temperature ?? 0.5,
      agent.webSearch ?? true,
    ]);
    if (insertedAgent.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add agent");

    const mappedAgent: Agent = {
      id: insertedAgent.rows[0].id,
      userId: insertedAgent.rows[0].user_id,
      workspaceId: insertedAgent.rows[0].workspace_id,
      name: insertedAgent.rows[0].name,
      type: insertedAgent.rows[0].type,
      model: insertedAgent.rows[0].model,
      systemInstructions: insertedAgent.rows[0].system_instructions,
      stack: insertedAgent.rows[0].stack,
      temperature: insertedAgent.rows[0].temperature,
      webSearch: insertedAgent.rows[0].web_search,
      createdAt: insertedAgent.rows[0].created_at,
      updatedAt: insertedAgent.rows[0].updated_at
    };

    res.status(201).json({ message: "Agent added", data: mappedAgent});
  } catch (error: any) {
    console.error("Failed to add agent: ", error.stack || error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addAgent;