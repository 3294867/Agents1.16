import { Request, Response } from "express";
import { AgentFE, AgentType } from "../types";
import utils from "../utils";
import { pool } from '..';

interface RequestBody {
  agentType: AgentType;
}

const getAgentByType = async (req: Request, res: Response) => {
  const { agentType }: RequestBody = req.body;

  const validationError = utils.validate.getAgentByType({ agentType });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError })

  try {
    const getAgent = await pool.query(`
      SELECT *
      FROM agents
      WHERE type = $1::text;
    `, [ agentType ]);
    if (getAgent.rows[0].length === 0) utils.sendResponse({ res, status: 404, message: "Failed to fetch agent" });

    const getWorkspaceId = await pool.query(`
      SELECT workspace_id
      FROM workspace_agent
      WHERE agent_id = $1::uuid;
    `, [ getAgent.rows[0].id ]);

    const agent: AgentFE = {
      id: getAgent.rows[0].id,
      name: getAgent.rows[0].name,
      type: getAgent.rows[0].type,
      model: getAgent.rows[0].model,
      systemInstructions: getAgent.rows[0].system_instructions,
      stack: getAgent.rows[0].stack,
      temperature: getAgent.rows[0].temperature,
      webSearch: getAgent.rows[0].web_search,
      workspaceId: getWorkspaceId.rows[0].workspace_id,
      createdAt: getAgent.rows[0].created_at,
      updatedAt: getAgent.rows[0].updated_at
    };
    
    res.status(200).json({
      message: "Agent fetched",
      data: agent
    });
  } catch (err) {
    console.error(`Failed to fetch agent: ${err}`);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAgentByType;