import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { AgentType } from '../types';

interface Props {
  agentType: AgentType;
}

const getAvailableAgent = async (req: Request, res: Response) => {
  const { agentType }: Props = req.body;

  try {
    const resultQueryText = `
      SELECT * FROM "Agent"
      WHERE "userId" = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
        AND "type" = $1::text;
    `;
    const result = await pool.query(resultQueryText, [agentType]);
    if (!result) sendResponse(res, 404, "Failed to fetch available agent (PostgresDB)")

    res.status(200).json({
      message: "Available agent fetched",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Failed to fetch available agent (PostgresDB): ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAvailableAgent;