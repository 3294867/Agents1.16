import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { QueryPG } from '../types';

interface RequestBody {
  requestId: string;
  responseId: string;
}

const deleteQuery = async (req: Request, res: Response): Promise<void> => {
  const { requestId, responseId }: RequestBody = req.body;

  const validatationError = utils.validate.deleteQuery(requestId, responseId);
  if (validatationError) return utils.sendResponse(res, 400, validatationError);

  try {
    await pool.query(`BEGIN`);

    /** Get thread id */
    const selectedThreadId = await pool.query(`SELECT thread_id FROM thread_request WHERE request_id = $1::uuid;`, [ requestId ]);
    if (selectedThreadId.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread id");
    }

    /** Delete request */
    const deletedRequest = await pool.query(`DELETE FROM requests WHERE id = $1::uuid RETURNING id;`, [ requestId ]);
    if (deletedRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete request");
    }

    const deleteThreadRequest = await pool.query(`DELETE FROM thread_request WHERE thread_id = $1::uuid RETURNING thread_id;`, [ selectedThreadId.rows[0].thread_id ]);
    if (deleteThreadRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete thread_request");
    }

    /** Delte response */
    const deletedResponse = await pool.query(`DELETE FROM responses WHERE id = $1::uuid RETURNING id;`, [ responseId ]);
    if (deletedResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete response");
    }

    const deleteThreadResponse = await pool.query(`DELETE FROM thread_response WHERE thread_id = $1::uuid RETURNING thread_id;`, [ selectedThreadId.rows[0].thread_id ]);
    if (deleteThreadResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete thread_response");
    }
    
    /** Update thread */
    const selectedThreadBody = await pool.query(`SELECT body FROM threads WHERE id = $1::uuid;`, [ selectedThreadId.rows[0].thread_id ]);
    if (selectedThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread body");
    }
    
    const filteredThreadBody: QueryPG[] = selectedThreadBody.rows[0].body
      .filter((q: QueryPG) => q.request_id !== requestId);

    const updatedThreadBody = await pool.query(`UPDATE threads SET body = $1::jsonb WHERE id = $2::uuid RETURNING id;`,[
      JSON.stringify(filteredThreadBody), selectedThreadId.rows[0].thread_id
    ]);
    if (updatedThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to update thread body");
    }

    await pool.query(`COMMIT`);

    utils.sendResponse(res, 200, 'Query deleted');
  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || rollbackError);
    }
    console.error("Failed to delete query: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default deleteQuery;