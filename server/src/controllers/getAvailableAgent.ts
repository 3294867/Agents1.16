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
    const getRootUserId = await pool.query(`SELECT "id" FROM "User" WHERE "name" = 'Root'::text;`);
    if (!getRootUserId) sendResponse(res, 404, "Failed to get root user id");
    
    const getAgent = await pool.query(`SELECT * FROM "Agent" WHERE "userId" = $1::uuid AND "type" = $2::text;`, [
      getRootUserId.rows[0].id, agentType
    ]);
    if (!getAgent) sendResponse(res, 404, "Failed to fetch available agent");

    res.status(200).json({
      message: "Available agent fetched",
      data: getAgent.rows[0]
    });

  } catch (error) {
    console.error("Failed to fetch available agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAvailableAgent;