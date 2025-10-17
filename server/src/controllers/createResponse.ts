import { Request, Response } from "express";
import { pool } from '..';
import utils from "../utils";
import { AgentModel } from "../types";

interface RequestBody {
  agentId: string;
  agentModel?: AgentModel;
  input: string;
}

const createResponse = async (req: Request, res: Response): Promise<void> => {
  const { agentId, agentModel, input }: RequestBody = req.body;

  const validationError = await utils.validate.createResponse({ agentId, input, agentModel });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getAgent = await pool.query(`
      SELECT model, system_instructions
      FROM agents
      WHERE id = $1::uuid;
    `, [ agentId ]);
    if (getAgent.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent" });

    const {
      message: inferOutputFormatMessage,
      data: inferOutputFormatData
    } = await utils.scripts.inferOutputFormat({ userInput: input});
    if (!inferOutputFormatData) {
      return utils.sendResponse({ res, status: 500, message: inferOutputFormatMessage });
    }

    const {
      message: createResponseMessage,
      data: createResponseData
    } = await utils.scripts.createResponse({ outputFormat: inferOutputFormatData, userInput: input});
    if (!createResponseData) {
      return utils.sendResponse({ res, status: 500, message: createResponseMessage });
    }

    res.status(201).json({
      message: createResponseMessage,
      data: {
        type: inferOutputFormatData,
        output: JSON.stringify(createResponseData)
      }
    });
  } catch (err) {
    console.error("Spawn failed:", err);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createResponse;
