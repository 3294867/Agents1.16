import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  requestId: string;
  requestBody: string;
}

const updateRequestBody = async (req: Request, res: Response): Promise<void> => {
  const { requestId, requestBody }: RequestBody = req.body;

  const validationError = utils.validate.updateRequestBody(requestId, requestBody);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const updateRequest = await pool.query(`
      UPDATE requests
      SET body = $1::text
      WHERE id = $2::uuid
      RETURNING id;
    `, [ requestBody, requestId ]);
    if (updateRequest.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update request body");

    utils.sendResponse(res, 200, "Request body updated");
  } catch (error: any) {
    console.error("Failed to update request body: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default updateRequestBody;