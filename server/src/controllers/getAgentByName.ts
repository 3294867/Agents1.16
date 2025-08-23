import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  userId: string;
  agentName: string;
}

const getAgentByName = async (req: Request, res: Response) => {
  const { userId, agentName }: Props = req.body;

  try {
    const getAgent = await pool.query(`SELECT * FROM "Agent" WHERE "userId" = $1::uuid AND "name" = $2::text;`, [
      userId, agentName
    ]);
    if (!getAgent) return sendResponse(res, 404, "Failed to fetch agent");
    
    res.status(200).json({
      message: "Agent has been fetched",
      data: getAgent.rows[0]
    });

  } catch (error) {
    console.error("Failed to fetch agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgentByName;