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
    const getWorkspacesData = await pool.query(`
      SELECT w.*, wu.user_role
      FROM workspaces w
      JOIN workspace_user wu ON w.id = wu.workspace_id
      WHERE wu.user_id = $1::uuid;
    `, [ userId ]);
    if (getWorkspacesData.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces data");

    const workspaces: WorkspaceFE[] = [];
    for (const item of getWorkspacesData.rows) {
      const getWorkspaceAgents = await pool.query(`
        SELECT agent_id
        FROM workspace_agent
        WHERE workspace_id = $1::uuid;
      `, [ item.id ]);
      if (getWorkspaceAgents.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace agents");
      const agentIds = getWorkspaceAgents.rows.map((i: { agent_id: string }) => i.agent_id);

      const workspace: WorkspaceFE = {
        id: item.id,
        name: item.name,
        description: item.description,
        userRole: item.user_role,
        agentIds,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
      workspaces.push(workspace);
    }

    res.status(200).json({
      message: "Workspaces fetched",
      data: workspaces
    });
  } catch (error) {
    console.error("Failed to fetch workspaces: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getWorkspaces;