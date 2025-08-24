import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  threadId: string;
}

const getThreadUpdatedAt = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    const getThreadUpdatedAt = await pool.query(`SELECT "updatedAt" FROM "Thread" WHERE "id" = $1::uuid;`, [ threadId ]);
    if (!getThreadUpdatedAt) return utils.controllers.sendResponse(res, 404, "Failed to fetch 'updatedAt' property of the thread")

    res.status(200).json({
      message: "Thread fetched",
      data: getThreadUpdatedAt.rows[0].updatedAt
    });

  } catch (error) {
    console.error("Failed to fetch 'updatedAt' property of the thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getThreadUpdatedAt;