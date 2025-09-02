import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  workspaceId: string;
}

const getWorkspaceAgents = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaceAgents(workspaceId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM workspace_agent
      WHERE workspace_id = $1::uuid;
    `, [ workspaceId ]);
    if (getAgentIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent ids");
    const agentIds = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getAgents = await pool.query(`
      SELECT id, name, type, model, system_instructions, stack, temperature, web_search, created_at, updated_at
      FROM agents
      WHERE id = ANY($1::uuid[]);
    `, [ agentIds ]);
    if (getAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agents data");

    const agentsData = [];
    for (const item of getAgents.rows) {
      const agentData = {
        id: item.id,
        name: item.name,
        type: item.type,
        model: item.model,
        systemInstructions: item.system_instructions,
        stack: item.stack,
        temperature: item.temperature,
        webSearch: item.web_search,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
      agentsData.push(agentData);
    } 
    
    res.status(200).json({
      message: "Agents data fetched",
      data: { agentsData }
    });
  } catch (error: any) {
    console.error("Failed to fetch agents: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getWorkspaceAgents;