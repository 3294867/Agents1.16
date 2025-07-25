import { Request, Response } from "express";
import { pool } from '..';
import { sendResponse } from '../utils/sendResponse';

interface Props {
  id: string;
  userId: string;
  agentId: string;
};

const createThread = async (req: Request, res: Response) => {
  const { id, userId, agentId }: Props = req.body;

  try {
    /** Insert thread into the database (PostgresDB) */
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

    /** On success send data (Client) */
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