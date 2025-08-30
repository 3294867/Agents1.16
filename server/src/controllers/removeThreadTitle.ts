import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const removeThreadTitle = async (req: Request, res: Response): Promise<void> => {
  const { threadId }: RequestBody = req.body;

  const validationError = utils.validate.removeThreadTitle(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const removedThreadTitle = await pool.query(`UPDATE threads SET name = NULL WHERE id = $1::uuid RETURNING id;`, [
      threadId
    ]);
    if (removedThreadTitle.rows.length === 0) return utils.sendResponse(res, 503, "Failed to remove thread title");

    utils.sendResponse(res, 200, "Thread title removed");
  } catch (error: any) {
    console.error("Failed to remove thread title: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default removeThreadTitle;