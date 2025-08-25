import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  requestId: string;
  requestBody: string;
}

const updateRequestBody = async (req: Request, res: Response) => {
  const { requestId, requestBody }: Props = req.body;

  try {
    const updateRequest = await pool.query(`UPDATE "Request" SET "body" = $1::text WHERE "id" = $2::uuid RETURNING "id";`, [
      requestBody, requestId
    ]);
    if (updateRequest.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update request body");

    res.status(200).json({
      message: "Request body updated",
    });

  } catch (error) {
    console.error("Failed to update request body: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default updateRequestBody;