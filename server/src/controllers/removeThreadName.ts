import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const removeThreadName = async (req: Request, res: Response): Promise<void> => {
  const { threadId }: RequestBody = req.body;

  const validationError = utils.validate.removeThreadTitle({ threadId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const removeThreadTitle = await pool.query(`
      UPDATE threads
      SET name = NULL
      WHERE id = $1::uuid
      RETURNING id;
    `, [ threadId ]);
    if (removeThreadTitle.rows.length === 0) return utils.sendResponse({ res, status: 503, message: "Failed to remove thread name" });

    utils.sendResponse({ res, status: 200, message: "Thread name removed" });
  } catch (error) {
    console.error("Failed to remove thread name: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default removeThreadName;