import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { Query } from '../types';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
}

const deleteQuery = async (req: Request, res: Response) => {
  const { threadId, requestId, responseId }: Props = req.body;

  try {
    await pool.query("BEGIN");

    /** Delete request from Request Table (PostgresDB) */
    const requestDeletedQueryText = `
      DELETE FROM "Request"
      WHERE "id" = $1::uuid
    `;
    const requestDeleted = await pool.query(requestDeletedQueryText, [requestId]);
    if (!requestDeleted) sendResponse(res, 503, "Failed to delete request");
  
    /** Delete response from Response Table (PostgresDB) */
    const responseDeletedQueryText = `
      DELETE FROM "Request"
      WHERE "id" = $1::uuid
    `;
    const responseDeleted = await pool.query(responseDeletedQueryText, [responseId]);
    if (!responseDeleted) sendResponse(res, 503, "Failed to delete response");

    /** Get thread body from the Thread Table (PostgresDB) */
    const threadBodyQueryText = `
      SELECT "body" FROM "Thread" WHERE "id" = $1::uuid;      
    `;
    const threadBody = await pool.query(threadBodyQueryText, [
      threadId,
    ]);
    if (!threadBody) sendResponse(res, 404, "Failed to fetch thread body");
    
    /** Update thread body in the Thread Table (PostgresDB) */
    const updatedThreadBody: Query[] = threadBody.rows[0].body.filter((q: Query) => q.requestId !== requestId);
    const threadBodyUpdatedQueryText = `
      UPDATE "Thread" SET "body" = $1::jsonb WHERE "id" = $2::uuid; 
    `;
    const threadBodyUpdated = await pool.query(threadBodyUpdatedQueryText, [
      JSON.stringify(updatedThreadBody),
      threadId
    ]);
    if (!threadBodyUpdated) sendResponse(res, 503, "Failed to update thread body");

    await pool.query("COMMIT");

    /** On success send message (Client) */
    res.status(200).json({
      message: "Query deleted",
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

export default deleteQuery;