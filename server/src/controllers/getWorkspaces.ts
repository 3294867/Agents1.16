import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { WorkspaceJS } from '../types';

interface RequestBody {
  userId: string;
}

const getWorkspaces = async (req: Request, res: Response): Promise<void> => {
  const { userId }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaces(userId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedWorkspacesIds = await pool.query(`SELECT workspace_id FROM workspace_user WHERE user_id = $1::uuid;`, [ userId ]);
    if (selectedWorkspacesIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace ids")
    const mappedSelectedWorkspacesIds = selectedWorkspacesIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const selectedWorkspaces = await pool.query(`SELECT * FROM workspaces WHERE id = ANY($1::uuid[]);`, [
      mappedSelectedWorkspacesIds
    ]);
    if (selectedWorkspaces.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch workspaces")
    
    let mappedWorkSpaces: WorkspaceJS[] = [];
    for (const workspace of selectedWorkspaces.rows) {
      const mappedWorkspace = {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        createdAt: workspace.created_at,
        updatedAt: workspace.updated_at
      };
      mappedWorkSpaces.push(mappedWorkspace);
    }

    res.status(200).json({
      message: "Workspaces fetched",
      data: { workspaces: mappedWorkSpaces }
    });

  } catch (error: any) {
    console.error("Failed to fetch workspaces: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getWorkspaces;