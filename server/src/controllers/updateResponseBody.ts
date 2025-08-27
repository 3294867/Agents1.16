import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  responseId: string;
  responseBody: string;
}

const updateResponseBody = async (req: Request, res: Response) => {
  const { responseId, responseBody }: Props = req.body;

  try {
    const updateResponse = await pool.query(`UPDATE "Response" SET "body" = $1::text WHERE "id" = $2::uuid RETURNING "body";`, [
      responseBody, responseId
    ]);
    if (updateResponse.rows.length === 0) return utils.sendResponse(res, 503, "Failed to update response body");
    
    res.status(200).json({
      message: "Response body updated",
      data: updateResponse.rows[0].body
    });

  } catch (error) {
    console.error("Failed to update response body: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default updateResponseBody;