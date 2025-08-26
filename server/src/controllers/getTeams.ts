import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  userId: string;
}

const getTeams = async (req: Request, res: Response) => {
  const { userId }: Props = req.body;

  try {
    const getTeams = await pool.query(`SELECT * FROM "Team" WHERE $1 = ANY("userIds") ORDER BY "createdAt";`, [
      userId
    ]);
    if (getTeams.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch teams");
    
    res.status(200).json({
      message: "Teams have been fetched",
      data: getTeams.rows
    });

  } catch (error) {
    console.error("Failed to fetch teams: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getTeams;