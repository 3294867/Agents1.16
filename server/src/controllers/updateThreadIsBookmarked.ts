import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
  isBookmarked: boolean;
}

const updateThreadIsBookmarked = async (req: Request, res: Response): Promise<void> => {
  const { threadId, isBookmarked }: RequestBody = req.body;

  const validationError = utils.validate.updateThreadIsBookmarked(threadId, isBookmarked);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const updateThread = await pool.query(`
      UPDATE threads
      SET is_bookmarked = $1::boolean
      WHERE id = $2::uuid
      RETURNING id;
    `, [ !isBookmarked, threadId ]);
    if (updateThread.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update thread 'isBookmarked' property");

    utils.sendResponse(res, 200, "Thread 'isBookmarked' property updated");
  } catch (error) {
    console.error("Failed to update thread 'isBookmarked' property: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default updateThreadIsBookmarked;