import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const updateThreadIsBookmarked = async (req: Request, res: Response) => {
  const { threadId, isBookmarked }: Props = req.body;

  try {
    const updateThread = await pool.query(`UPDATE "Thread" SET "isBookmarked" = $1::boolean WHERE "id" = $2::uuid RETURNING "id";`, [
      isBookmarked, threadId
    ]);
    if (updateThread.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update 'isBookmarked' property")

    res.status(200).json({
      message: "'isBookmarked' property of the thread updated"
    });

  } catch (error) {
    console.error("Failed to update 'isBookmarked' property of the thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default updateThreadIsBookmarked;