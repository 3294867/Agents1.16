import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  userId: string;
  teamName: string;
}

const getTeamByName = async (req: Request, res: Response) => {
  const { userId, teamName }: Props = req.body;

  try {
    const getTeam = await pool.query(`SELECT * FROM "Team" WHERE $1 = ANY("userIds") AND "name" = $2::text;`, [
      userId, teamName
    ]);
    if (getTeam.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch team");
    
    res.status(200).json({
      message: "Team has been fetched",
      data: getTeam.rows[0]
    });

  } catch (error) {
    console.error("Failed to fetch team: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getTeamByName;