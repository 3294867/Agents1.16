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
    const selectedAgentIds = await pool.query(`SELECT agent_id FROM user_agent WHERE user_id = $1::uuid`, [ userId ]);
    if (selectedAgentIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent ids");
    const mappedSelectedAgentIds = selectedAgentIds.rows.map((i: { agent_id: string }) => i.agent_id); 

    const selectedAgents = await pool.query(`SELECT id, updated_at FROM agents WHERE id = ANY($1::uuid[])`, [ mappedSelectedAgentIds ]);
    if (selectedAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agentsUpdatedAt");

    const mappedSelectedAgents = selectedAgents.rows.map((i: { id: string, updated_at: string}) => {
      return {
        id: i.id,
        updatedAt: i.updated_at
      }
    });

    res.status(200).json({
      message: "agentsUpdatedAt fetched",
      data: { agentsData: mappedSelectedAgents }
    });

  } catch (error: any) {
    console.error("Failed to get agentsUpdatedAt", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getAgentsUpdatedAt;