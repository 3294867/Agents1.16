import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

const getAvailableAgents = async (_: Request, res: Response): Promise<void> => {
  try {
    const getRootUserId = await pool.query(`
      SELECT id
      FROM users
      WHERE name = 'root'::text;
    `);
    if (getRootUserId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get root user id");

    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ getRootUserId.rows[0].id ]);
    const agentIds = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
    
    const getAgents = await pool.query(`
      SELECT name, type, model, system_instructions, stack, temperature, web_search
      FROM agents
      WHERE id = ANY($1::uuid[]);
    `, [ agentIds ]);
    if (getAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get available agents");

    const agentsData = [];
    for (const item of getAgents.rows) {
      const agentData = {
        name: item.name,
        type: item.type,
        model: item.model,
        systemInstructions: item.system_instructions,
        stack: item.stack,
        temperature: item.temperature,
        webSearch: item.web_search
      };
      agentsData.push(agentData);
    }

    res.status(200).json({
      message: "Available agents fetched",
      data: { agentsData }
    });
  } catch (error) {
    console.error("Failed to get available agents: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getAvailableAgents;