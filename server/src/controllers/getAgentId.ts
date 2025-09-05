import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
  workspaceName: string;
  agentName: string;
}

const getAgentId = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceName, agentName }: RequestBody = req.body;

  const validationError = utils.validate.getAgentId({ userId, workspaceName, agentName });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    /** Get workspace id */
    const getWorkspaceIds = await pool.query(`
      SELECT workspace_id
      FROM workspace_user
      WHERE user_id = $1::uuid;
    `, [ userId ]);
    if (getWorkspaceIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get workspaces ids" });
    const workspaceIds: string[] = getWorkspaceIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const getWorkspaceId = await pool.query(`
      SELECT id
      FROM workspaces
      WHERE id = ANY($1::uuid[]) AND name = $2::text;
    `, [ workspaceIds, workspaceName ]);
    if (getWorkspaceId.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get workspace id" });
    
    /** Get agent id*/
    const getAgentIds = await pool.query(`
      SELECT agent_id
      FROM workspace_agent
      WHERE workspace_id = $1::uuid;
    `, [ getWorkspaceId.rows[0].id ]);
    if (getAgentIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent ids" });
    const agentIds: string[] = getAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const getAgentId = await pool.query(`
      SELECT id
      FROM agents
      WHERE id = ANY($1::uuid[]) AND name = $2::text;
    `, [ agentIds, agentName ]);
    if (getAgentId.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent id" });
    
    res.status(200).json({
      message: "Agent id fetched",
      data: getAgentId.rows[0].id
    });
  } catch (error) {
    console.error("Failed to fetch agent: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAgentId;