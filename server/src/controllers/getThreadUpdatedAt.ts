import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const getThreadUpdatedAt = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = utils.validate.getThreadUpdatedAt(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedThreadUpdatedAt = await pool.query(`SELECT updated_at FROM threads WHERE id = $1::uuid`, [ threadId ]);
    if (selectedThreadUpdatedAt.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch thread updatedAt");

    res.status(200).json({
      message: "Thread udpatedAt fetched",
      data: { threadUpdatedAt: selectedThreadUpdatedAt.rows[0].updated_at }
    });

  } catch (error: any) {
    console.error("Failed to fetch thread updatedAt: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getThreadUpdatedAt;