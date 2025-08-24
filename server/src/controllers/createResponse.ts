import { Request, Response } from "express";
import { client, pool } from "../index";
import utils from '../utils';
import { AgentModel } from '../types';

interface Props {
  agentId: string;
  agentModel: AgentModel;
  input: string;
}

const createResponse = async (req: Request, res: Response) => {
  const { agentId, agentModel, input }: Props = req.body;

  try {
    const instructions = await pool.query(`SELECT "systemInstructions" FROM "Agent" WHERE "id" = $1::uuid;`, [ agentId ]);
    if (!instructions) return utils.controllers.sendResponse(res, 404, "Failed to get instructions");

    const apiResponse = await client.responses.create({
      model: agentModel,
      input,
      instructions: instructions.rows[0].systemInstructions
    });
    if (!apiResponse) return utils.controllers.sendResponse(res, 503, "Failed to get response");

    res.status(200).json({
      message: "apiResponse created",
      data: apiResponse.output_text
    });
    
  } catch (error) {
    console.error("Failed to create apiResponse: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default createResponse;