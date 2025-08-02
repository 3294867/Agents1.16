import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  userId: string;
}

const getAgentsUpdatedAt = async (req: Request, res: Response) => {
  const { userId } = req.body as Props;

  try {
    /** Get 'updatedAt' property for each agent (PostgresDB) */
    const resultQueryText = `
      SELECT "id", "updatedAt" FROM "Agent" WHERE "userId" = $1::uuid;
    `;
    const result = await pool.query(resultQueryText, [ userId ]);
    if (!result) sendResponse(res, 404, "Failed to get 'updatedAt' property for each agent (PostgresDB)")

    /** On success send data (Client) */
    res.status(200).json({
      message: "'updatedAt' property for each agent fetched (PostgresDB)",
      data: result.rows
    });

  } catch (error) {
    console.error("Failed to get 'updatedAt' property for each agent (PostgresDB): ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgentsUpdatedAt;