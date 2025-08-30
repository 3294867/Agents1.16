import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { AgentType } from '../types';

interface RequestBody {
  agentType: AgentType;
}

const getAvailableAgentByType = async (req: Request, res: Response): Promise<void> => {
  const { agentType }: RequestBody = req.body;

  const validationError = utils.validate.getAvailableAgentByType(agentType);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedRootUserId = await pool.query(`SELECT id FROM users WHERE name = 'root;`);
    if (selectedRootUserId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get root user id");
    
    const selectedAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid`, [ selectedRootUserId.rows[0].id ]);
    const mappedSelectedAgentIds = selectedAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const selectedAgent = await pool.query(`
      SELECT name, model, system_instructions, stack, temperature, web_search
      FROM agents WHERE id = ANY($1::uuid) AND type = $2::text; 
    `, [ mappedSelectedAgentIds, agentType ]);

    res.status(200).json({
      message: "Available agent fetched",
      data: {
        agentName: selectedAgent.rows[0].name,
        agentModel: selectedAgent.rows[0].model,
        agentSystemInstructions: selectedAgent.rows[0].system_instructions,
        agentStack: selectedAgent.rows[0].stack,
        agentTemperature: selectedAgent.rows[0].temperature,
        agentWebSearch: selectedAgent.rows[0].web_search
      }
    });

  } catch (error: any) {
    console.error("Failed to fetch available agent: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getAvailableAgentByType;