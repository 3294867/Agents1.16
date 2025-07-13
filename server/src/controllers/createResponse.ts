import { Request, Response } from "express";
import { client, pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface RequestBody {
  threadId: string;
  model: "gpt-4.1" | "gpt-4o" | "gpt-4o-audio-preview" | "chatgpt-4o",
  body: string;
}

const createResponse = async (req: Request, res: Response) => {
  const { threadId, model, body } = req.body as RequestBody;

  try {
    /** Get instructions from the database */
    const instructionsQueryText = `
      WITH thread_info AS (
        SELECT "agentId"
        FROM "Thread"
        WHERE "id" = $1::uuid
      )
      SELECT "systemInstructions"
      FROM "Agent", thread_info
      WHERE "Agent"."id" = thread_info."agentId";
    `;
    
    const instructions = await pool.query(instructionsQueryText, [threadId]);
    if (!instructions) return sendResponse(res, 404, "Failed to get instructions.")
    
    /** Create openai response */
    const apiResponse = await client.responses.create({
      model: model,
      input: body,
      instructions: instructions.rows[0].systemInstructions
    });
    if (!apiResponse) return sendResponse(res, 503, "Failed to get response.");

    /** Send response to the client */
    res.status(200).json({
      message: "apiResponse created.",
      data: apiResponse.output_text
    })
    
  } catch (error) {
    console.error("Failed to create apiResponse: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default createResponse;