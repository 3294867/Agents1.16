import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  threadId: string;
  threadTitle: string;
}

const updateThreadTitle = async (req: Request, res: Response) => {
  const { threadId, threadTitle }: Props = req.body;

  try {
    const updateThreadTitle = await pool.query(`UPDATE "Thread" SET "title" = $1::text WHERE "id" = $2::uuid;`, [
      threadTitle, threadId
    ]);
    if (!updateThreadTitle) return utils.controllers.sendResponse(res, 503, "Failed to update thread title");

    res.status(200).json({
      message: "Thread title updated"
    })
  } catch (error) {
    console.error("Failed to update thread title: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default updateThreadTitle;