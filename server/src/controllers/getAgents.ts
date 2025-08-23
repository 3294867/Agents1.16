import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  userId: string;
}

const getAgents = async (req: Request, res: Response) => {
  const { userId }: Props = req.body;

  try {
    const result = await pool.query(`SELECT * FROM "Agent" WHERE "userId" = $1::uuid ORDER BY "createdAt";`, [
      userId
    ]);
    if (!result) return sendResponse(res, 404, "Failed to fetch agents");
    
    res.status(200).json({
      message: "Agents have been fetched",
      data: result.rows
    });

  } catch (error) {
    console.error("Failed to fetch agents: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgents;