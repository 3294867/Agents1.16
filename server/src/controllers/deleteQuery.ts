import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { Query } from '../types';

interface RequestBody {
  threadId: string;
  requestId: string;
  responseId: string;
}

const deleteQuery = async (req: Request, res: Response): Promise<void> => {
  const { threadId, requestId, responseId }: RequestBody = req.body;

  const validatationError = utils.validate.deleteQuery(threadId, requestId, responseId);
  if (validatationError) return utils.sendResponse(res, 404, validatationError);

  try {
    await pool.query(`BEGIN`);

    const deletedRequest = await pool.query(`DELETE FROM requests WHERE id = $1::uuid RETURNING id;`, [ requestId ]);
    if (deletedRequest.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete request");
    }
  
    const deletedResponse = await pool.query(`DELETE FROM responses WHERE id = $1::uuid RETURNING id;`, [ responseId ]);
    if (deletedResponse.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 503, "Failed to delete response");
    }

    const selectedThreadBody = await pool.query(`SELECT body FROM threads WHERE id = $1::uuid;`, [ threadId ]);
    if (selectedThreadBody.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      return utils.sendResponse(res, 404, "Failed to get thread body");
    }
    
    const newThreadBody: Query[] = selectedThreadBody.rows[0].body.filter((q: Query) => q.requestId !== requestId);

    const updatedThreadBody = await pool.query(`UPDATE threads SET body = $1::jsonb WHERE id = $2::uuid RETURNING id;`,[
      JSON.stringify(newThreadBody), threadId
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