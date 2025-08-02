import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  userId: string;
  agentName: string;
}

const getAgent = async (req: Request, res: Response) => {
  const { userId, agentName }: Props = req.body;

  try {
    /** Get agent from the database (PostgresDB) */
    const queryText = `
      SELECT * FROM "Agent"
      WHERE "userId" = $1::uuid
        AND "name" = $2::text
    `;
    const result = await pool.query(queryText, [
      userId,
      agentName
    ])
    if (!result) return sendResponse(res, 404, "Failed to fetch agent");
    
    /** On success send data (Client) */
    res.status(200).json({
      message: "Agent has been fetched",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Failed to fetch agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgent;