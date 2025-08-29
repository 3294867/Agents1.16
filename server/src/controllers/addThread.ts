import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  userId: string;
  agentId: string;
}

const addThread = async (req: Request, res: Response): Promise<void> => {
  const { userId, agentId }: RequestBody = req.body;

  const validationError = await utils.validate.addThread(userId, agentId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const addThread = await pool.query(`
      INSERT INTO threads (user_id, agent_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING id;
    `, [ userId, agentId ]);
    if (addThread.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add thread");

    res.status(200).json({
      message: "Thread added",
      data: { threadId: addThread.rows[0].id }
    });

  } catch (error: any) {
    console.error("Failed to add thread: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addThread;
