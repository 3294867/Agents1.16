import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

const getAvailableAgents = async (_: Request, res: Response): Promise<void> => {
  try {
    const selectedRootUserId = await pool.query(`SELECT id FROM users WHERE name = 'root'::text;`);
    if (selectedRootUserId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get root user id");

    const selectedAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid`, [
      selectedRootUserId.rows[0].id
    ]);
    const mappedSelectedAgentIds = selectedAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);
    
    const selectedAgents = await pool.query(`
      SELECT name, type, model, system_instructions, stack, temperature, web_search
      FROM agents WHERE id = ANY($1::uuid[]);
    `, [ mappedSelectedAgentIds ]);
    if (selectedAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch available agents")

    let agentsData = [];
    for (const agentData of selectedAgents.rows) {
      const mappedAgentData = {
        agentName: agentData.name,
        agentType: agentData.type,
        agentModel: agentData.model,
        agentSystemInstructions: agentData.system_instructions,
        agentStack: agentData.stack,
        agentTemperature: agentData.temperature,
        agentWebSearch: agentData.web_search
      };
      agentsData.push(mappedAgentData);
    }

    res.status(200).json({
      message: "Available agents fetched",
      data: { agentsData }
    });

  } catch (error) {
    console.error("Failed to fetch available agents: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getAvailableAgents;