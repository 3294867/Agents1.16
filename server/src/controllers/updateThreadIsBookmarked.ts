import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const updateThreadIsBookmarked = async (req: Request, res: Response) => {
  const { threadId, isBookmarked }: Props = req.body;

  try {
    /** Update 'isBookmarked' property of the thread (PostgresDB) */
    const queryText = `
      UPDATE "Thread"
      SET "isBookmarked" = $1::boolean
      WHERE "id" = $2::uuid;
    `;
    const result = await pool.query(queryText, [
      isBookmarked,
      threadId
    ])
    if (!result) return sendResponse(res, 503, "Failed to update 'isBookmarked' property")

    /** On success send response (Client) */
    res.status(200).json({
      message: "'isBookmarked' property of the thread updated"
    });

  } catch (error) {
    console.error("Failed to update thread 'isBookmarked' property of the thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default updateThreadIsBookmarked;