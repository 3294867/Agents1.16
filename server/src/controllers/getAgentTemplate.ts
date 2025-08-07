import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { AgentType } from '../types';

interface Props {
  agentType: AgentType;
}

const getAgentTemplate = async (req: Request, res: Response) => {
  const { agentType }: Props = req.body;

  try {
    const resultQueryText = `
      SELECT * FROM "AgentTemplate" WHERE "type" = $1::text;
    `;
    const result = await pool.query(resultQueryText, [agentType]);
    if (!result) sendResponse(res, 404, "Failed to get get agent template (PostgresDB)")

    res.status(200).json({
      message: "Agent template fetched",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Failed to get get agent template (PostgresDB): ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgentTemplate;