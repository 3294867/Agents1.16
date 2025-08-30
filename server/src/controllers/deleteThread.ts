import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  threadId: string;
}

const deleteThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId }: RequestBody = req.body;

  const validationError = utils.validate.deleteThread(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    await pool.query(`BEGIN`);
    
    const deletedThread = await pool.query(`DELETE FROM threads WHERE id = $1::uuid RETURNING id;`, [ threadId ]);
    if (deletedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete thread");
    }

    const deletedAgentThread = await pool.query(`DELETE FROM agent_thread WHERE thread_id = $1::uuid RETURNING agent_id;`, [ threadId ]);
    if (deletedAgentThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete agent_thread");
    }

    const deletedThreadRequest = await pool.query(`DELETE FROM thread_request WHERE thread_id = $1::uuid RETURNING thread_id;`, [ threadId ]);
    if (deletedThreadRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete thread_request");
    }

    const deletedThreadResponse = await pool.query(`DELETE FROM thread_response WHERE thread_id = $1::uuid RETURNING thread_id;`, [ threadId ]);
    if (deletedThreadResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete thread_response");
    }

    await pool.query(`COMMIT`);

    utils.sendResponse(res, 200, "Thread deleted");
  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || rollbackError);
    }
    console.error("Failed to delete thread: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default deleteThread;