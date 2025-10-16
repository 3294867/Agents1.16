import { Request, Response } from "express";
import path from "path";
import { pool } from '..';
import utils from "../utils";
import { AgentModel } from "../types";

interface RequestBody {
  agentId: string;
  agentModel?: AgentModel;
  input: string;
}

const createStructuredResponse = async (req: Request, res: Response): Promise<void> => {
  const { agentId, agentModel, input }: RequestBody = req.body;

  const validationError = await utils.validate.createStructuredResponse({ agentId, input, agentModel });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  const scriptPath = path.resolve(__dirname, "../scripts/create_structured_response.py");
  
  try {
    const getAgent = await pool.query(`
      SELECT model, system_instructions
      FROM agents
      WHERE id = $1::uuid;
    `, [ agentId ]);
    if (getAgent.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent" });

    const { message, data } = await utils.runPythonScript({ scriptPath, scriptInput: {
      model: agentModel ?? getAgent.rows[0].model,
      system_instructions: getAgent.rows[0].system_instructions,
      user_input: input
    }});
    
    if (!data) return utils.sendResponse({ res, status: 500, message })

    res.status(201).json({ message, data });
  } catch (err) {
    console.error("Spawn failed:", err);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createStructuredResponse;
