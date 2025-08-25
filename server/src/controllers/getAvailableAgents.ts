import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

const getAvailableAgents = async (req: Request, res: Response) => {
  try {
    const getRootUserId = await utils.getRootUserId();
    if (getRootUserId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get root user id");
    
    const getAvailableAgents = await pool.query(`SELECT * FROM "Agent" WHERE "userId" = $1::uuid;`, [
      getRootUserId.rows[0].id
    ]);
    if (getAvailableAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch available agents")

    res.status(200).json({
      message: "Available agents fetched",
      data: getAvailableAgents.rows
    });

  } catch (error) {
    console.error("Failed to fetch available agents: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAvailableAgents;