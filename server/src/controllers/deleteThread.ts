import { Request, Response } from "express";
import { pool } from '..';
import { sendResponse } from '../utils/sendResponse';

interface Props {
  threadId: string;
}

const deleteThread = async (req: Request, res: Response) => {
  const { threadId }: Props = req.body;

  try {
    const result = await pool.query(`DELETE FROM "Thread" WHERE "id" = $1::uuid;`, [ threadId ]);
    if (!result) return sendResponse(res, 503, "Failed to delete thread");

    res.status(200).json({
      message: "Thread deleted",
    });

  } catch (error) {
    console.error("Failed to delete thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default deleteThread;