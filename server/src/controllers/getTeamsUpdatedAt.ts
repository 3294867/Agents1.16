import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  userId: string;
}

const getTeamsUpdatedAt = async (req: Request, res: Response) => {
  const { userId } = req.body as Props;

  try {
    const getTeamsUpdatedAt = await pool.query(`SELECT "id", "updatedAt" FROM "Team" WHERE $1 = ANY("userIds")`, [ userId ]);
    if (getTeamsUpdatedAt.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch 'updatedAt' property for each team")

    res.status(200).json({
      message: "'updatedAt' property for each team has been fetched",
      data: getTeamsUpdatedAt.rows
    });

  } catch (error) {
    console.error("Failed to fetch 'updatedAt' property for each team: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getTeamsUpdatedAt;