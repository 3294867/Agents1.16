import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
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

    const addRequest = await pool.query(`
      INSERT INTO "Request" (
        "threadId", "body"
      )
      SELECT
        $1::uuid, $2::text
      RETURNING "id", "createdAt";
    `, [ threadId, requestBody ]);
    if (!addRequest) return utils.controllers.sendResponse(res, 503, "Failed to add request");

    const addResponse = await pool.query(`
      INSERT INTO "Response" (
        "threadId", "body"
      )
      SELECT
        $1::uuid, $2::text
      Returning "id", "createdAt";
    `, [ threadId, responseBody ]);
    if (!addResponse) return utils.controllers.sendResponse(res, 503, "Failed to add response");
    
    const getThreadBody = await pool.query(`SELECT "body" FROM "Thread" WHERE "id" = $1::uuid;`,[
      threadId
    ]);
    if (!getThreadBody) return utils.controllers.sendResponse(res, 404, "Failed to fetch thread body");

    let currentBody = getThreadBody.rows[0].body;
    if (!Array.isArray(currentBody)) currentBody = [];

    const newBody: Query[] = [...currentBody, { requestId: addRequest.rows[0].id, responseId: addResponse.rows[0].id }];

    const updateThread = await pool.query(`UPDATE "Thread" SET "body" = $1::jsonb WHERE "id" = $2::uuid;`, [
      JSON.stringify(newBody), threadId
    ]);
    if (!updateThread) return utils.controllers.sendResponse(res, 503, "Failed to update thread");

    await pool.query("COMMIT");

    res.status(200).json({
      message: "Thread updated",
      data: { requestId: addRequest.rows[0].id, responseId: addResponse.rows[0].id }
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