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
        $5::text,
        $6::text,
        $7::float,
        $8::boolean,
        $9::timestamp,
        $10::timestamp
      RETURNING *;
    `, [
      agent.id,
      agent.type,
      agent.model,
      agent.userId,
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