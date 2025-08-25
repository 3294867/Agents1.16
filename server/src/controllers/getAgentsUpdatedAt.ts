import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  userId: string;
}

const getAgentUpdatedAt = async (req: Request, res: Response) => {
  const { userId } = req.body as Props;

  try {
    const getAgentsUpdatedAt = await pool.query(`SELECT "id", "updatedAt" FROM "Agent" WHERE "userId" = $1::uuid;`, [ userId ]);
    if (getAgentsUpdatedAt.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get 'updatedAt' property for each agent")

    res.status(200).json({
      message: "'updatedAt' property for each agent fetched",
      data: getAgentsUpdatedAt.rows
    });

  } catch (error) {
    console.error("Failed to get 'updatedAt' property for each agent: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgentUpdatedAt;