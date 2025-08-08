import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

const getAvailableAgents = async (req: Request, res: Response) => {
  try {
    const resultQueryText = `
      SELECT * FROM "Agent" WHERE "id" = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid;
    `;
    const result = await pool.query(resultQueryText);
    if (!result) sendResponse(res, 404, "Failed to fetch available agents (PostgresDB)")

    res.status(200).json({
      message: "Available agents fetched",
      data: result.rows
    });

  } catch (error) {
    console.error("Failed to fetch available agents (PostgresDB): ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAvailableAgents;