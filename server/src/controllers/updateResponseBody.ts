import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  responseId: string;
  responseBody: string;
}

const updateResponseBody = async (req: Request, res: Response) => {
  const { responseId, responseBody }: Props = req.body;

  try {
    /** Update response body in the database (PostgresDB) */
    const resultQueryText = `
      UPDATE "Response"
      SET "body" = $1::text
      WHERE "id" = $2::uuid 
    `;

    const result = await pool.query(resultQueryText, [
      responseBody,
      responseId
    ]);
    if (!result) return sendResponse(res, 503, "Failed to update response body");

    /** On success send data (Client) */
    res.status(200).json({
      message: "Response body updated",
    });

  } catch (error) {
    console.error("Failed to update response body: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default updateResponseBody;