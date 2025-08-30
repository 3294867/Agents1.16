import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  responseId: string;
  responseBody: string;
}

const updateResponseBody = async (req: Request, res: Response): Promise<void> => {
  const { responseId, responseBody }: RequestBody = req.body;

  const validationError = utils.validate.updateResponseBody(responseId, responseBody);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const updatedResponse = await pool.query(`UPDATE responses SET body = $1::text WHERE id = $2::uuid RETURNING id;`, [
      responseBody, responseId
    ]);
    if (updatedResponse.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update response body");
    
    utils.sendResponse(res, 200, "Response body updated");
  } catch (error: any) {
    console.error("Failed to update response body: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default updateResponseBody;