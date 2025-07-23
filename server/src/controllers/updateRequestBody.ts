import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  requestId: string;
  requestBody: string;
};

const updateRequestBody = async (req: Request, res: Response) => {
  const { requestId, requestBody } = req.body as Props;

  try {
    const resultQueryText = `
      UPDATE "Request"
      SET "body" = $1::text
      WHERE "id" = $2::uuid 
    `;

    const result = await pool.query(resultQueryText, [
      requestBody,
      requestId
    ]);
    if (!result) return sendResponse(res, 503, "Failed to update request body.");

    /** Send response to the client */
    res.status(200).json({
      message: "Request body updated.",
    });

  } catch (error) {
    console.error("Failed to update request body: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default updateRequestBody;