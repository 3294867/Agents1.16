import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  userId: string;
  agentId: string;
}

const addThread = async (req: Request, res: Response): Promise<void> => {
  const { userId, agentId }: RequestBody = req.body;

  const validationError = utils.validate.addThread(userId, agentId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);
    
    const insertedThread = await pool.query(`INSERT INTO threads (created_at) VALUES (NOW()) RETURNING id;`);
    if (insertedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add thread");
    }

    const insertedAgentThread = await pool.query(`
      INSERT INTO agent_thread (agent_id, thread_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING agent_id;
    `, [ agentId, insertedThread.rows[0].id ]);
    if (insertedAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add agent thread");
    }

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: "Thread added",
      data: { threadId: insertedThread.rows[0].id }
    });

  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || rollbackError );
    }
    console.error("Failed to add thread: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addThread;
