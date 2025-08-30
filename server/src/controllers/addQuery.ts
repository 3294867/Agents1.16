import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { QueryPG } from '../types';

interface RequestBody {
  threadId: string;
  requestBody: string;
  responseBody: string;
}

const addQuery = async (req: Request, res: Response): Promise<void> => {
  const { threadId, requestBody, responseBody }: RequestBody = req.body;

  const validationError = await utils.validate.addQuery(threadId, requestBody, responseBody);
  if (validationError) return utils.sendResponse(res, 400, validationError);
  
  try {
    await pool.query(`BEGIN`);

    /** Request */
    const insertedRequest = await pool.query(`INSERT INTO requests (body) VALUES ($1::text) RETURNING id;`, [ requestBody ]);
    if (insertedRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add request");
    }

    const insertedThreadRequest = await pool.query(`INSERT INTO thread_request (thread_id, request_id) VALUES ($1::uuid, $2::uuid) RETURNING thread_id;`, [
      threadId, insertedRequest.rows[0].id
    ]);
    if (insertedThreadRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add thread_request");
    }

    /** Response */
    const insertedResponse = await pool.query(`INSERT INTO responses (body) VALUES ($1::text) RETURNING id;`, [ responseBody ]);
    if (insertedResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add response");
    }

    const insertedThreadResponse = await pool.query(`INSERT INTO thread_response (thread_id, response_id) VALUES ($1::uuid, $2::uuid) RETURNING thread_id;`, [
      threadId, insertedResponse.rows[0].id
    ]);
    if (insertedThreadResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to add thread_response");
    }

    /** Thread */
    const selectedThreadBody = await pool.query(`SELECT body FROM threads WHERE id = $1::uuid;`, [ threadId ]);
    if (selectedThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread");
    }

    const newThreadBody: QueryPG[] = [...selectedThreadBody.rows[0].body, { request_id: insertedRequest.rows[0].id, response_id: insertedResponse.rows[0].id }];

    const updatedThread = await pool.query(`UPDATE threads SET body = $1::jsonb WHERE id = $2::uuid RETURNING id;`, [
      JSON.stringify(newThreadBody), threadId
    ]);
    if (updatedThread.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to update thread");
    }

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: "Query added",
      data: { requestId: insertedRequest.rows[0].id, responseId: insertedResponse.rows[0].id }
    });

  } catch (error: any) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError: any) {
      console.error("Rollback error: ", rollbackError.stack || error);
    }
    console.error("Failed to add query: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default addQuery;