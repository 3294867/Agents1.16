import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
}

const getWorkspacesUpdatedAt = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body as RequestBody;

  const validationError = utils.validate.getWorkspacesUpdatedAt({ userId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getWorkspaceIds = await pool.query(`
      SELECT workspace_id
      FROM workspace_user
      WHERE user_id = $1::uuid;
    `, [ userId ]);
    if (getWorkspaceIds.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get workspaces ids" });
    const workspaceIds: string[] = getWorkspaceIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const getWorkspacesData = await pool.query(`
      SELECT id, updated_at
      FROM workspaces
      WHERE id = ANY($1::uuid[]);
    `, [ workspaceIds ]);
    if (getWorkspacesData.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get workspaces data" });

    const workspacesData: { id: string, updatedAt: Date }[] = [];
    for (const item of getWorkspacesData.rows) {
      const workspaceData = {
        id: item.id,
        updatedAt: item.updated_at
      };
      workspacesData.push(workspaceData);
    }
    
    res.status(200).json({
      message: "Workspaces data fetched",
      data: workspacesData
    });
  } catch (error) {
    console.error("Failed to fetch workspaces data: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getWorkspacesUpdatedAt;