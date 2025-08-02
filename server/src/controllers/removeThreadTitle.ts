import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  threadId: string;
}

const removeThreadTitle = async (req: Request, res: Response) => {
  const { threadId }: Props = req.body;

  try {
    /** Set 'title' property to null (PostgresDB) */
    const queryText = `
      UPDATE "Thread"
      SET "title" = NULL
      WHERE "id" = $1::uuid;
    `;
    const result = await pool.query(queryText, [
      threadId
    ])
    if (!result) return sendResponse(res, 503, "Failed to remove thread title")

    /** On success send data (Client) */
    res.status(200).json({
      message: "Thread title removed"
    })
  } catch (error) {
    console.error("Failed to remove thread title: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default removeThreadTitle;