import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { AgentType } from '../types';

interface Props {
  userId: string;
  agentType: AgentType;
}

const getAgentByType = async (req: Request, res: Response) => {
  const { userId, agentType }: Props = req.body;

  try {
    const getAgent = await pool.query(`SELECT * FROM "Agent" WHERE "userId" = $1::uuid AND "type" = $2::text;`, [
      userId, agentType
    ]);
    if (!getAgent || getAgent.rows[0].length === 0) return sendResponse(res, 404, "Failed to fetch agent");
    
    res.status(200).json({
      message: "Agent has been fetched",
      data: getAgent.rows[0]
    });

  } catch (error) {
    console.error("Failed to fetch agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgentByType;