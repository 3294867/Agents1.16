import { Request, Response } from "express";
import { client, pool } from "../index";
import utils from '../utils';
import { AgentModel } from '../types';

interface RequestBody {
  agentId: string;
  input: string;
  agentModel?: AgentModel;
}

const createResponse = async (req: Request, res: Response): Promise<void> => {
  const { agentId, input, agentModel }: RequestBody = req.body;

  const validationError = await utils.validate.createResponse(agentId, input, agentModel);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getAgent = await pool.query(`
      SELECT model, system_instructions
      FROM agents
      WHERE id = $1::uuid;
    `, [ agentId ]);
    if (getAgent.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent");

    const apiResponse = await client.responses.create({
      model: agentModel ?? getAgent.rows[0].model,
      input,
      instructions: getAgent.rows[0].system_instructions
    });
    if (!apiResponse.output_text) return utils.sendResponse(res, 503, "Failed to get response");

    res.status(201).json({
      message: "Response created",
      data: apiResponse.output_text
    });
  } catch (error) {
    console.error("Failed to create response: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default createResponse;