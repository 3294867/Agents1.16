import { Request, Response } from "express";
import { pool } from '..';
import { sendResponse } from '../utils/sendResponse';
import { AgentType } from '../types';

interface Props {
  userId: string;
  agentType: AgentType;
}

const addAgent = async (req: Request, res: Response) => {
  const { userId, agentType }: Props = req.body;
  const agentName = agentType;
  const systemInstructions = `You are a ${agentName} AI Agent`;

  try {
    const queryText = `
      INSERT INTO "Agent" (
        "type",
        "model",
        "userId",
        "name",
        "systemInstructions"
      )
      SELECT
        $1::text,
        'gpt-3.5-turbo'::text,
        $2::uuid,
        $3::text,
        $4::text
      RETURNING *;
    `;
    const result = await pool.query(queryText, [
      agentType,
      userId,
      agentName,
      systemInstructions
    ])
    if (!result) return sendResponse(res, 503, "Failed to add agent");

    res.status(200).json({
      message: "Agent added",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Failed to add agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addAgent;