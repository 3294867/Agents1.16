import { Request, Response } from "express";
import { pool } from "..";
import { sendResponse } from "../utils/sendResponse";

interface RequestType {
  threadId: string;
}

const getThread = async (req: Request, res: Response) => {
  const { threadId } = req.body as RequestType;

  try {
    const resultQueryText = `
      SELECT * FROM "Thread"
      WHERE "id" = $1::uuid
    `;
    
    const result = await pool.query(resultQueryText, [
      threadId
    ]);

    if (!result) sendResponse(res, 404, "Failed to fetch thread.")

    res.status(200).json({
      message: "Thread fetched.",
      data: result.rows[0]
    })

  } catch (error) {
    console.error("Failed to fetch thread: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export default getThread;