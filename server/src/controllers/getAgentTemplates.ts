import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

const getAgentTemplates = async (req: Request, res: Response) => {
  try {
    const resultQueryText = `
      SELECT * FROM "AgentTemplate";
    `;
    const result = await pool.query(resultQueryText);
    if (!result) sendResponse(res, 404, "Failed to get get agent templates (PostgresDB)")

    res.status(200).json({
      message: "Agent templates fetched",
      data: result.rows
    });

  } catch (error) {
    console.error("Failed to get get agent templates (PostgresDB): ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAgentTemplates;