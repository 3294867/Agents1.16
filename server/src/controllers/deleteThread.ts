import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const deleteThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId }: RequestBody = req.body;

  const validationError = utils.validate.deleteThread(threadId);
  if (validationError) return utils.sendResponse(res, 404, validationError);

  try {
    const deletedThread = await pool.query(`DELETE FROM threads WHERE id = $1::uuid RETURNING id;`, [ threadId ]);
    if (deletedThread.rows.length === 0) return utils.sendResponse(res, 503, "Failed to delete thread");

    utils.sendResponse(res, 200, "Thread deleted");
  } catch (error: any) {
    console.error("Failed to delete thread: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default deleteThread;