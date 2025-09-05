import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  workspaceId: string;
}

const getAgentNames = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId }: RequestBody = req.body;

  const validationError = utils.validate.getAgentNames({ workspaceId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM workspace_agent
      WHERE workspace_id = $1::uuid;
    `, [ workspaceId ]);
    if (getAgentIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent ids" });

    const agentIds: string[] = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getAgentNames = await pool.query(`
      SELECT name
      FROM agents
      WHERE id = ANY($1::uuid[]);
    `, [ agentIds ]);
    if (getAgentNames.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent names" });

    const agentNames: string[] = getAgentNames.rows.map((i: { name: string }) => i.name);
    
    res.status(200).json({
      message: "Agent names fetched",
      data: agentNames
    });
    
  } catch (error) {
    console.error("Failed to fetch agent: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAgentNames;