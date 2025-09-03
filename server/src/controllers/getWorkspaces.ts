import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { UserRole, WorkspaceFE } from '../types';

interface RequestBody {
  userId: string;
}

const getWorkspaces = async (req: Request, res: Response): Promise<void> => {
  const { userId }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaces(userId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getWorkspaceData = await pool.query(`
      SELECT workspace_id, user_role
      FROM workspace_user
      WHERE user_id = $1::uuid;
    `, [ userId ]);
    if (getWorkspaceData.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace ids");
    const workspaceIds = getWorkspaceData.rows.map((i: { workspace_id: string, user_role: UserRole }) => i.workspace_id);
    const workspaceUserRoles = getWorkspaceData.rows.map((i: { workspace_id: string, user_role: UserRole }) => i.user_role);

    const getWorkspaces = await pool.query(`
      SELECT *
      FROM workspaces
      WHERE id = ANY($1::uuid[]);
    `, [ workspaceIds ]);
    if (getWorkspaces.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces");

    const getWorkspaceAgentIds = await pool.query(`
      SELECT agent_id
      FROM workspace_agent
      WHERE workspace_id = ANY($1::uuid[]);
    `, [ workspaceIds ]); 
    if (getWorkspaceAgentIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace agents");
    const agentIds = getWorkspaceAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const workspaces: WorkspaceFE[] = [];
    for (const item of getWorkspaces.rows) {
      for (const userRole of workspaceUserRoles) {
        const workspace = {
          id: item.id,
          name: item.name,
          description: item.description,
          userRole,
          agentIds: agentIds,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        };
        workspaces.push(workspace);
      }
    }

    res.status(200).json({
      message: "Workspaces fetched",
      data: workspaces
    });
  } catch (error: any) {
    console.error("Failed to fetch workspaces: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getWorkspaces;