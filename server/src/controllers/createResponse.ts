import { Request, Response } from "express";
import { client, pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import { AgentModel } from '../types';

interface Props {
  threadId: string;
  agentModel: AgentModel;
  input: string;
}

const createResponse = async (req: Request, res: Response) => {
  const { threadId, agentModel, input }: Props = req.body;

  try {
    /** Get instructions from the database (PostgresDB) */
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
    if (!instructions) return sendResponse(res, 404, "Failed to get instructions.");

    /** Create response (OpenAI) */
    const apiResponse = await client.responses.create({
      model: agentModel,
      input,
      instructions: instructions.rows[0].systemInstructions
    });
    if (!apiResponse) return sendResponse(res, 503, "Failed to get response.");

    /** On success send data (Client) */
    res.status(200).json({
      message: "apiResponse created.",
      data: apiResponse.output_text
    });
    
  } catch (error) {
    console.error("Failed to create apiResponse: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default createResponse;