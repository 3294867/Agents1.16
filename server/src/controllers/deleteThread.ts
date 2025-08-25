import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface Props {
  threadId: string;
}

const deleteThread = async (req: Request, res: Response) => {
  const { threadId }: Props = req.body;

  try {
    const deleteThread = await pool.query(`DELETE FROM "Thread" WHERE "id" = $1::uuid RETURNING "id";`, [ threadId ]);
    if (deleteThread.rows.length === 0) return utils.sendResponse(res, 503, "Failed to delete thread");

    res.status(200).json({
      message: "Thread deleted",
    });

  } catch (error) {
    console.error("Failed to delete thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default deleteThread;