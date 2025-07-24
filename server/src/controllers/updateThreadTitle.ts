import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  threadId: string;
  threadTitle: string;
};

const updateThreadTitle = async (req: Request, res: Response) => {
  const { threadId, threadTitle }: Props = req.body;

  try {
    /** Update thread title in the database (PostgresDB) */
    const queryText = `
      UPDATE "Thread"
      SET "title" = $1::text
      WHERE "id" = $2::uuid;
    `;
    const result = await pool.query(queryText, [
      threadTitle,
      threadId
    ])
    if (!result) return sendResponse(res, 503, "Failed to update thread title.")

    /** On success send data (Client) */
    res.status(200).json({
      message: "Thread title updated."
    })
  } catch (error) {
    console.error("Failed to update thread title: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default updateThreadTitle;