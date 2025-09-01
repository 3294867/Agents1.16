import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { WorkspaceBE } from '../types';

interface RequestBody {
  userId: string;
}

const getWorkspaces = async (req: Request, res: Response): Promise<void> => {
  const { userId }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaces(userId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getWorkspaceIds = await pool.query(`
      SELECT workspace_id
      FROM workspace_user
      WHERE user_id = $1::uuid;
    `, [ userId ]);
    if (getWorkspaceIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace ids");
    const workspaceIds = getWorkspaceIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const getWorkspaces = await pool.query(`
      SELECT *
      FROM workspaces
      WHERE id = ANY($1::uuid[]);
    `, [ workspaceIds ]);
    if (getWorkspaces.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces");
    
    const workspaces: WorkspaceBE[] = [];
    for (const item of getWorkspaces.rows) {
      const workspace = {
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
      workspaces.push(workspace);
    }

    res.status(200).json({
      message: "Workspaces fetched",
      data: { workspaces }
    });
  } catch (error: any) {
    console.error("Failed to fetch workspaces: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getWorkspaces;