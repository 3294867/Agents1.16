import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const getThreadUpdatedAt = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = utils.validate.getThreadUpdatedAt({ threadId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getThreadUpdatedAt = await pool.query(`
      SELECT updated_at
      FROM threads
      WHERE id = $1::uuid;
    `, [ threadId ]);
    if (getThreadUpdatedAt.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get thread updatedAt" });

    res.status(200).json({
      message: "Thread updatedAt fetched",
      data: getThreadUpdatedAt.rows[0].updated_at
    });
  } catch (error) {
    console.error("Failed to get thread updatedAt: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getThreadUpdatedAt;