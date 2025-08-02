import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  threadId: string;
}

const getThreadUpdatedAt = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    /** Get 'updatedAt' property of the thread (PostgresDB) */
    const resultQueryText = `
      SELECT "updatedAt" FROM "Thread" WHERE "id" = $1::uuid;
    `;
    const result = await pool.query(resultQueryText, [ threadId ]);
    if (!result) sendResponse(res, 404, "Failed to fetch 'updatedAt' property of the thread")

    /** On success send data (Client) */
    res.status(200).json({
      message: "Thread fetched",
      data: result.rows[0].updatedAt
    });

  } catch (error) {
    console.error("Failed to fetch 'updatedAt' property of the thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getThreadUpdatedAt;