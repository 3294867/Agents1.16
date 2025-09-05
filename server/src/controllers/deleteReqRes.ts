import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { ReqResPG } from '../types';

interface RequestBody {
  requestId: string;
  responseId: string;
}

const deleteReqRes = async (req: Request, res: Response): Promise<void> => {
  const { requestId, responseId }: RequestBody = req.body;

  const validationError = utils.validate.deleteReqRes({ requestId, responseId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    await pool.query(`BEGIN`);

    const getThreadId = await pool.query(`
      SELECT thread_id
      FROM thread_request
      WHERE request_id = $1::uuid;
    `, [ requestId ]);
    if (getThreadId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get thread id" });
    }

    /** Delete request */
    const deleteRequest = await pool.query(`
      DELETE FROM requests
      WHERE id = $1::uuid
      RETURNING id;
    `, [ requestId ]);
    if (deleteRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete request" });
    }

    const deleteThreadRequest = await pool.query(`
      DELETE FROM thread_request
      WHERE thread_id = $1::uuid
      RETURNING thread_id;
    `, [ getThreadId.rows[0].thread_id ]);
    if (deleteThreadRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete thread request" });
    }

    /** Delete response */
    const deleteResponse = await pool.query(`
      DELETE FROM responses
      WHERE id = $1::uuid
      RETURNING id;
    `, [ responseId ]);
    if (deleteResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete response" });
    }

    const deleteThreadResponse = await pool.query(`
      DELETE FROM thread_response
      WHERE thread_id = $1::uuid
      RETURNING thread_id;
    `, [ getThreadId.rows[0].thread_id ]);
    if (deleteThreadResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to delete thread response" });
    }
    
    /** Update thread */
    const getThreadBody = await pool.query(`
      SELECT body
      FROM threads
      WHERE id = $1::uuid;
    `, [ getThreadId.rows[0].thread_id ]);
    if (getThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 404, message: "Failed to get thread body" });
    }
    
    const filteredThreadBody: ReqResPG[] = getThreadBody.rows[0].body
      .filter((q: ReqResPG) => q.request_id !== requestId);

    const updateThreadBody = await pool.query(`
      UPDATE threads
      SET body = $1::jsonb
      WHERE id = $2::uuid
      RETURNING id;
    `, [ JSON.stringify(filteredThreadBody), getThreadId.rows[0].thread_id ]);
    if (updateThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse({ res, status: 503, message: "Failed to update thread body" });
    }

    await pool.query(`COMMIT`);

    utils.sendResponse({ res, status: 200, message: 'Reqres deleted' });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to delete reqres: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default deleteReqRes;