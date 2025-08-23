import { Request, Response } from "express";
import { client, pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  agentId: string;
  input: string;
}

const inferAgentType = async (req: Request, res: Response) => {
  const { agentId, input }: Props = req.body;

  try {
    const result = await pool.query(`SELECT "type" FROM "Agent" WHERE "id" = $1::uuid;`, [ agentId ]);
    if (!result) return sendResponse(res, 404, "Failed to get 'type' property of the agent");

    const query = `
      Choose the most appropriate agent type for the following question: ${input}.
      Available agent types: "general", "math", "geography", "literature".
      Return in lower case agent type only.
    `;

    const apiResponse = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: query,
      instructions: result.rows[0].type
    });
    if (!apiResponse) return sendResponse(res, 503, "Failed to get response");

    res.status(200).json({
      message: "apiResponse created",
      data: apiResponse.output_text
    });
    
  } catch (error) {
    console.error("Failed to get appropriate agent type: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default inferAgentType;