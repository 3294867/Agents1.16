import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const deleteThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId }: RequestBody = req.body;

  const validationError = utils.validate.deleteThread({ threadId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    await pool.query(`BEGIN`);
    
    const deleteThread = await pool.query(`
      DELETE FROM threads
      WHERE id = $1::uuid
      RETURNING id;
    `, [ threadId ]);
    if (deleteThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete thread" });
    }

    const deleteAgentThread = await pool.query(`
      DELETE FROM agent_thread
      WHERE thread_id = $1::uuid
      RETURNING agent_id;
    `, [ threadId ]);
    if (deleteAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete agent thread" });
    }

    const deleteThreadRequest = await pool.query(`
      DELETE FROM thread_request
      WHERE thread_id = $1::uuid
      RETURNING thread_id;
    `, [ threadId ]);
    if (deleteThreadRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete thread request" });
    }

    const deleteThreadResponse = await pool.query(`
      DELETE FROM thread_response
      WHERE thread_id = $1::uuid
      RETURNING thread_id;
    `, [ threadId ]);
    if (deleteThreadResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete thread response" });
    }

    await pool.query(`COMMIT`);

    utils.sendResponse({ res, status: 200, message: "Thread deleted" });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to delete thread: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default deleteThread;