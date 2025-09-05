import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import constants from '../constants';
import { AddAgent, AgentType } from '../types';

interface RequestBody {
  workspaceId: string;
}

const getAvailableAgents = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId }: RequestBody = req.body;

  const validationError = utils.validate.getAvailableAgents({ workspaceId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });
  
  try {
    /** Existing agent types */
    const getExistingAgentIds = await pool.query(`
      SELECT agent_id
      FROM workspace_agent
      WHERE workspace_id = $1::uuid;
    `, [ workspaceId ]);
    if (getExistingAgentIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get existing agent ids" });
    const existingAgentIds: string[] = getExistingAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getExistingAgentTypes = await pool.query(`
      SELECT type
      FROM agents
      WHERE id = ANY($1::uuid[]);
    `, [ existingAgentIds ]);
    if (getExistingAgentTypes.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get existing agent types" });

    const existingAgentTypes: AgentType[] = getExistingAgentTypes.rows.map((i: { type: AgentType }) => i.type);
    let remainingAgentTypes = constants.data.agentTypes;
    for (const item of existingAgentTypes) {
      remainingAgentTypes = remainingAgentTypes.filter(i => i !== item);
    }

    /** Root agents */
    const getRootUserId = await pool.query(`
      SELECT id
      FROM users
      WHERE name = 'root'::text;
    `);
    if (getRootUserId.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get root user id" });
    
    const getRootAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ getRootUserId.rows[0].id ]);
    const rootAgentIds = getRootAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
    if (getRootAgentIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get root agent ids" });
    
    /** Available agents */
    const getAvailableAgentsData = await pool.query(`
      SELECT name, type, model, system_instructions, stack, temperature, web_search
      FROM agents
      WHERE type = ANY($1::text[])
        AND id = ANY($2::uuid[]); 
    `, [ remainingAgentTypes, rootAgentIds ]);
    if (getAvailableAgentsData.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get available agents data" });

    const availableAgentsData: AddAgent[] = [];
    for (const item of getAvailableAgentsData.rows) {
      const agentData = {
        name: item.name,
        type: item.type,
        model: item.model,
        systemInstructions: item.system_instructions,
        stack: item.stack,
        temperature: item.temperature,
        webSearch: item.web_search
      };
      availableAgentsData.push(agentData);
    }

    res.status(200).json({
      message: "Available agents data fetched",
      data: availableAgentsData
    });
  } catch (error) {
    console.error("Failed to get available agents: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAvailableAgents;