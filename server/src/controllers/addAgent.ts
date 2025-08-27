import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';
import { Agent } from '../types';

interface Props {
  agent: Agent;
}

const addAgent = async (req: Request, res: Response) => {
  const { agent }: Props = req.body;

  try {
    const addAgent = await pool.query(`
      INSERT INTO "Agent" (
        "id",
        "type",
        "model",
        "userId",
        "teamId",
        "teamName",
        "name",
        "systemInstructions",
        "temperature",
        "webSearch",
        "createdAt",
        "updatedAt"
      )
      SELECT
        $1::uuid,
        $2::text,
        $3::text,
        $4::uuid,
        $5::uuid,
        $6::text,
        $7::text,
        $8::text,
        $9::float,
        $10::boolean,
        $11::timestamp,
        $12::timestamp
      RETURNING *;
    `, [
      agent.id,
      agent.type,
      agent.model,
      agent.userId,
      agent.teamId,
      agent.teamName,
      agent.name,
      agent.systemInstructions,
      agent.temperature,
      agent.webSearch,
      agent.createdAt,
      agent.updatedAt
    ]);
    if (addAgent.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add agent");

    res.status(200).json({
      message: "Agent added",
      data: addAgent.rows[0]
    });

  } catch (error) {
    console.error("Failed to add agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addAgent;