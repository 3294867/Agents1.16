import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
  workspaceName: string;
  agentName: string;
}

const getAgentByName = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceName, agentName }: RequestBody = req.body;

  const validationError = utils.validate.getAgentByName(userId);
  if (validationError) return utils.sendResponse(res, 404, validationError);

  try {
    const selectedUserWorkspacesIds = await pool.query(`SELECT workspace_id FROM workspace_users WHERE user_id = $1::uuid;`, [ userId ]);
    if (selectedUserWorkspacesIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces ids");

    const selectedWorkspaceId = await pool.query(`SELECT id FROM workspaces WHERE user_id = $1::uuid AND name = $2::text`,[
      userId, workspaceName
    ]);
    if (selectedWorkspaceId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace id");
    
    const selectedAgent = await pool.query(`
      SELECT id FROM agents WHERE user_id = $1::uuid
        AND workspace_id = $2::text
        AND name = $3::text;
    `, [
      userId, selectedWorkspaceId.rows[0].id, agentName
    ]);
    if (selectedAgent.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent");
    
    res.status(200).json({
      message: "Agent has been fetched",
      data: selectedAgent.rows[0].id
    });

  } catch (error: any) {
    console.error("Failed to fetch agent: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getAgentByName;