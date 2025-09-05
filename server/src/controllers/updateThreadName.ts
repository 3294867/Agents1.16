import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
  threadName: string;
}

const updateThreadName = async (req: Request, res: Response): Promise<void> => {
  const { threadId, threadName }: RequestBody = req.body;

  const validationError = utils.validate.updateThreadName({ threadId, threadName });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const updateThreadName = await pool.query(`
      UPDATE threads
      SET name = $1::text
      WHERE id = $2::uuid
      RETURNING id;
    `, [ threadName, threadId ]);
    if (updateThreadName.rows.length === 0) return utils.sendResponse({ res, status: 503, message: "Failed to update thread name" });

    utils.sendResponse({ res, status: 200, message: "Thread name updated" });
  } catch (error) {
    console.error("Failed to update thread name: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default updateThreadName;