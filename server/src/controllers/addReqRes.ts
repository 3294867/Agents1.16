import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { ReqResPG } from '../types';

interface RequestBody {
  threadId: string;
  requestBody: string;
  responseBody: string;
}

const addReqRes = async (req: Request, res: Response): Promise<void> => {
  const { threadId, requestBody, responseBody }: RequestBody = req.body;

  const validationError = await utils.validate.addQuery(threadId, requestBody, responseBody);
  if (validationError) return utils.sendResponse(res, 400, validationError);
  
  try {
    await pool.query(`BEGIN`);

    /** Request */
    const addRequest = await pool.query(`
      INSERT INTO requests (body)
      VALUES ($1::text)
      RETURNING id;
    `, [ requestBody ]);
    if (addRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add request");
    }

    const addThreadRequest = await pool.query(`
      INSERT INTO thread_request (thread_id, request_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING thread_id;
    `, [ threadId, addRequest.rows[0].id ]);
    if (addThreadRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add thread request");
    }

    /** Response */
    const addResponse = await pool.query(`
      INSERT INTO responses (body)
      VALUES ($1::text)
      RETURNING id;
    `, [ responseBody ]);
    if (addResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add response");
    }

    const addThreadResponse = await pool.query(`
      INSERT INTO thread_response (thread_id, response_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING thread_id;
    `, [ threadId, addResponse.rows[0].id ]);
    if (addThreadResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add thread response");
    }

    /** Thread */
    const getThreadBody = await pool.query(`
      SELECT body
      FROM threads
      WHERE id = $1::uuid;
    `, [ threadId ]);
    if (getThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread");
    }

    const newThreadBody: ReqResPG[] = [
      ...getThreadBody.rows[0].body,
      { request_id: addRequest.rows[0].id, response_id: addResponse.rows[0].id }
    ];

    const updateThread = await pool.query(`
      UPDATE threads
      SET body = $1::jsonb
      WHERE id = $2::uuid
      RETURNING id;
    `, [ JSON.stringify(newThreadBody), threadId ]);
    if (updateThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to update thread");
    }

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: "Query added",
      data: {
        requestId: addRequest.rows[0].id,
        responseId: addResponse.rows[0].id
      }
    });
  } catch (error) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to add query: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addReqRes;