import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { AgentType } from '../types';

interface RequestBody {
  agentType: AgentType;
}

const getAvailableAgentByType = async (req: Request, res: Response): Promise<void> => {
  const { agentType }: RequestBody = req.body;

  const validationError = utils.validate.getAvailableAgentByType({ agentType });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getRootUserId = await pool.query(`
      SELECT id
      FROM users
      WHERE name = 'root'::text;
    `);
    if (getRootUserId.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get root user id" });
    
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ getRootUserId.rows[0].id ]);
    const agentIds: string[] = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getAgent = await pool.query(`
      SELECT name, model, system_instructions, stack, temperature, web_search
      FROM agents
      WHERE id = ANY($1::uuid[]) AND type = $2::text;
    `, [ agentIds, agentType ]);

    res.status(200).json({
      message: "Available agent fetched",
      data: {
        name: getAgent.rows[0].name,
        model: getAgent.rows[0].model,
        systemInstructions: getAgent.rows[0].system_instructions,
        stack: getAgent.rows[0].stack,
        temperature: getAgent.rows[0].temperature,
        webSearch: getAgent.rows[0].web_search
      }
    });
  } catch (error) {
    console.error("Failed to fetch available agent: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAvailableAgentByType;