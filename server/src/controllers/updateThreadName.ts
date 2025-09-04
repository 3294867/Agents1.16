import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
  threadName: string;
}

const updateThreadName = async (req: Request, res: Response): Promise<void> => {
  const { threadId, threadName }: RequestBody = req.body;

  const validationError = utils.validate.updateThreadName(threadId, threadName);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const updateThreadName = await pool.query(`
      UPDATE threads
      SET name = $1::text
      WHERE id = $2::uuid
      RETURNING id;
    `, [ threadName, threadId ]);
    if (updateThreadName.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update thread name");

    utils.sendResponse(res, 200, "Thread name updated");
  } catch (error) {
    console.error("Failed to update thread name: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default updateThreadName;