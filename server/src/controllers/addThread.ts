import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  agentId: string;
}

const addThread = async (req: Request, res: Response): Promise<void> => {
  const { agentId }: RequestBody = req.body;

  const validationError = utils.validate.addThread({ agentId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    await pool.query(`BEGIN`);
    
    const addThread = await pool.query(`
      INSERT INTO threads (created_at)
      VALUES (NOW())
      RETURNING id;
    `);
    if (addThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add thread" });
    }

    const addAgentThread = await pool.query(`
      INSERT INTO agent_thread (agent_id, thread_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING agent_id;
    `, [ agentId, addThread.rows[0].id ]);
    if (addAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to add agent thread" });
    }

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: "Thread added",
      data: {
        id: addThread.rows[0].id,
        createdAt: addThread.rows[0].created_at,
        updatedtAt: addThread.rows[0].updatead_at
      }
    });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError );
    }
    console.error("Failed to add thread: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default addThread;
