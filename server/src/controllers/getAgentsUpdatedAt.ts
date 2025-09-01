import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
}

const getAgentsUpdatedAt = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body as RequestBody;

  const validationError = utils.validate.getAgentsUpdatedAt(userId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM user_agent
      WHERE user_id = $1::uuid;
    `, [ userId ]);
    if (getAgentIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent ids");
    const agentIds = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id); 

    const getAgentsData = await pool.query(`
      SELECT id, updated_at
      FROM agents
      WHERE id = ANY($1::uuid[]);
    `, [ agentIds ]);
    if (getAgentsData.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agents data");

    const agentsData = getAgentsData.rows.map((i: { id: string, updated_at: string}) => {
      return {
        id: i.id,
        updatedAt: i.updated_at
      }
    });

    res.status(200).json({
      message: "Agents data fetched",
      data: { agentsData }
    });
  } catch (error: any) {
    console.error("Failed to get agents data: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getAgentsUpdatedAt;