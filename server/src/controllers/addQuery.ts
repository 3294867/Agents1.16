import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { Query } from '../types';

interface Props {
  threadId: string;
  requestBody: string;
  responseBody: string;
}

const addQuery = async (req: Request, res: Response) => {
  const { threadId, requestBody, responseBody }: Props = req.body;

  try {
    await pool.query("BEGIN");

    /** Store request in the database (PostgresDB) */
    const requestQueryText = `
      INSERT INTO "Request" ("threadId", "body")
      VALUES ($1::uuid, $2::text)
      RETURNING "id", "createdAt";
    `;
    const request = await pool.query(requestQueryText, [threadId, requestBody]);
    if (!request) return sendResponse(res, 503, "Failed to add request");

    /** Store response in the database (PostgresDB) */
    const responseQueryText = `
      INSERT INTO "Response" (
        "threadId",
        "body"
      )
      SELECT
        $1::uuid AS "threadId",
        $2::text AS "body"
      Returning "id", "createdAt";
    `;
    const response = await pool.query(responseQueryText, [
      threadId,
      responseBody
    ]);
    if (!response) return sendResponse(res, 503, "Failed to add response");
    
    /** Get current thread body from database (PostgresDB) */
    const threadBodyQueryText = `
      SELECT "body"
      FROM "Thread"
      WHERE "id" = $1::uuid
    `;
    const threadBody = await pool.query(threadBodyQueryText, [
      threadId
    ]);
    if (!threadBody) return sendResponse(res, 404, "Failed to fetch thread body");

    let currentBody = threadBody.rows[0].body;
    if (!Array.isArray(currentBody)) {
      currentBody = [];
    };

    const newBody: Query[] = [...currentBody, {
      requestId: request.rows[0].id,
      responseId: response.rows[0].id
    }];

    /** Update thread body in the database (PostgresDB) */
    const threadQueryText = `
      UPDATE "Thread"
      SET "body" = $1::jsonb
      WHERE "id" = $2::uuid;
    `;
    const thread = await pool.query(threadQueryText, [
      JSON.stringify(newBody),
      threadId
    ]);
    if (!thread) return sendResponse(res, 503, "Failed to update thread");

    await pool.query("COMMIT");

    /** On success send data (Client) */
    res.status(200).json({
      message: "Thread updated",
      data: {
        requestId: request.rows[0].id,
        responseId: response.rows[0].id
      }
    });

  } catch (error) {
    try {
      await pool.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to update thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addQuery;