import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { NormalizedAgents } from "../types";

const getAgents = async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };

  try {
    const queryText = `
      SELECT * FROM "Agent" WHERE "userId" = $1::uuid
      ORDER BY "createdAt";
    `;
    const result = await pool.query(queryText, [
      userId
    ])
    if (!result) return sendResponse(res, "Failed to fetch agents.");
    
    const normalizedResult = result.rows.reduce(
      (acc: NormalizedAgents, slot) => {
        acc.byId[slot.id] = slot
        acc.allIds.push(slot.id)
        return acc;
      },
      { byId: {}, allIds: [] }
    );

    /** Send response to the client */
    res.format({"application/json": () => {
      res.send({
        message: "Agents have been fetched.",
        data: normalizedResult
      });
    }});
    

  } catch (error) {
    console.error("Failed to fetch agents: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default getAgents;