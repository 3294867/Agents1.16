import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface Props {
  id: string;
  userId: string;
  agentId: string;
}

const addThread = async (req: Request, res: Response) => {
  const { id, userId, agentId }: Props = req.body;

  try {
    const addThread = await pool.query(`
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
    `, [ id, userId, agentId ]);
    if (!addThread) return utils.controllers.sendResponse(res, 503, "Failed to add thread");

    res.status(200).json({
      message: "Thread added",
      data: addThread.rows[0]
    });

  } catch (error) {
    console.error("Failed to add thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addThread;