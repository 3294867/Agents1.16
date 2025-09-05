import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  workspaceId: string;
  agentName: string;
}

const getAgent = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId, agentName }: RequestBody = req.body;

  const validationError = utils.validate.getAgent({ workspaceId, agentName });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM workspace_agent
      WHERE workspace_id = $1::uuid;
    `, [ workspaceId ]);
    if (getAgentIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent ids" });
    const agentIds: string[] = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getAgentData = await pool.query(`
      SELECT id, type, model, system_instructions, stack, temperature, web_search, created_at, updated_at
      FROM agents
      WHERE id = ANY($1::uuid[])
        AND name = $2::text;
    `, [ agentIds, agentName ]);
    if (getAgentData.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent data" });

    res.status(200).json({
      message: "Agent fetched",
      data: {
        id: getAgentData.rows[0].id,
        name: agentName,
        type: getAgentData.rows[0].type,
        model: getAgentData.rows[0].model,
        systemInstructions: getAgentData.rows[0].system_instructions,
        stack: getAgentData.rows[0].stack,
        temperature: getAgentData.rows[0].temperature,
        webSearch: getAgentData.rows[0].web_search,
        workspaceId,
        createdAt: getAgentData.rows[0].created_at,
        updatedAt: getAgentData.rows[0].updated_at
      }
    });
  } catch (error) {
    console.error("Failed to fetch agent: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAgent;