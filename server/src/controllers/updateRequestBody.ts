import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  requestId: string;
  requestBody: string;
}

const updateRequestBody = async (req: Request, res: Response): Promise<void> => {
  const { requestId, requestBody }: RequestBody = req.body;

  const validationError = utils.validate.updateRequestBody({ requestId, requestBody });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const updateRequest = await pool.query(`
      UPDATE requests
      SET body = $1::text
      WHERE id = $2::uuid
      RETURNING id;
    `, [ requestBody, requestId ]);
    if (updateRequest.rows.length === 0) return utils.sendResponse({ res, status: 503, message: "Failed to update request body" });

    utils.sendResponse({ res, status: 200, message: "Request body updated" });
  } catch (error) {
    console.error("Failed to update request body: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default updateRequestBody;