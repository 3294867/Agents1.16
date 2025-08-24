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

    const deleteRequest = await pool.query(`DELETE FROM "Request" WHERE "id" = $1::uuid;`, [ requestId ]);
    if (!deleteRequest) return sendResponse(res, 503, "Failed to delete request");
  
    const deleteResponse = await pool.query(`DELETE FROM "Request" WHERE "id" = $1::uuid;`, [ responseId ]);
    if (!deleteResponse) return sendResponse(res, 503, "Failed to delete response");

    const getThreadBody = await pool.query(`SELECT "body" FROM "Thread" WHERE "id" = $1::uuid;`, [ threadId ]);
    if (!getThreadBody) return sendResponse(res, 404, "Failed to fetch thread body");
    
    const updatedThreadBody: Query[] = getThreadBody.rows[0].body.filter((q: Query) => q.requestId !== requestId);

    const updateThreadBody = await pool.query(`UPDATE "Thread" SET "body" = $1::jsonb WHERE "id" = $2::uuid;`,[
      JSON.stringify(updatedThreadBody), threadId
    ]);
    if (!updateThreadBody) return sendResponse(res, 503, "Failed to update thread body");

    await pool.query("COMMIT");

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