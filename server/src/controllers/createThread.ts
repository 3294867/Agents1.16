import { Request, Response } from "express";
import { pool } from '..';
import { sendResponse } from '../utils/sendResponse';

const createThread = async (req: Request, res: Response) => {
  const { id, userId, agentId } = req.body as { id: string, userId: string, agentId: string };

  try {
    const queryText = `
      INSERT INTO "Thread" (
        "id",
        "userId",
        "agentId",
        "body"
      )
      SELECT
        $1::uuid,
        $2::uuid,
        $3::uuid,
        '{}'::jsonb
      RETURNING *;
    `;
    const result = await pool.query(queryText, [
      id,
      userId,
      agentId
    ])
    if (!result) return sendResponse(res, 503, "Failed to create thread.");

    /** Send response to the client */
    res.status(200).json({
      message: "Thread fetched.",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Failed to create thread: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default createThread;