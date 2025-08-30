import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { AgentJS } from '../types';

interface RequestBody {
  userId: string;
}

const getAgents = async (req: Request, res: Response): Promise<void> => {
  const { userId }: RequestBody = req.body;

  const validationError = utils.validate.getAgents(userId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid;`, [ userId ]);
    if (selectedAgentIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent ids");
    const mappedSelectedAgentIds = selectedAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const selectedAgents = await pool.query(`SELECT * FROM agents WHERE id = ANY($1::uuid[]);`, [ mappedSelectedAgentIds ]);
    if (selectedAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agents");

    let mappedSelectedAgents: AgentJS[] = [];
    for (const agent of selectedAgents.rows) {
      const mappedAgent = {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        model: agent.model,
        systemInstructions: agent.system_instructions,
        stack: agent.stack,
        temperature: agent.temperature,
        webSearch: agent.web_search,
        createdAt: agent.created_at,
        updatedAt: agent.updated_at
      };
      mappedSelectedAgents.push(mappedAgent);
    } 
    
    res.status(200).json({
      message: "Agents fetched",
      data: { agents: mappedSelectedAgents }
    });

  } catch (error: any) {
    console.error("Failed to fetch agents: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getAgents;