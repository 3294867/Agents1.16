import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
}

const getWorkspacesUpdatedAt = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body as RequestBody;

  const validationError = utils.validate.getWorkspacesUpdatedAt(userId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedWorkspacesIds = await pool.query(`SELECT workspace_id FROM workspace_user WHERE user_id = $1::uuid;`, [ userId ]);
    if (selectedWorkspacesIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces ids")
    const mappedSelectedWorkspacesIds = selectedWorkspacesIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const selectedWorkspacesData = await pool.query(`SELECT id, updated_at FROM workspaces WHERE id = ANY($1::uuid[]);`, [
      mappedSelectedWorkspacesIds
    ]);
    if (selectedWorkspacesData.rows.length === 0) return utils.sendResponse(res, 400, "Failed to get workspaces data");

    let mappedSelectedWorkspacesData: { id: string, updatedAt: Date }[] = [];
    for (const workspace of selectedWorkspacesData.rows) {
      const mappedWorkspace = {
        id: workspace.id,
        updatedAt: workspace.updated_at
      };
      mappedSelectedWorkspacesData.push(mappedWorkspace);
    }
    
    res.status(200).json({
      message: "Workspaces data fetched",
      data: { workspacesData: mappedSelectedWorkspacesData }
    });

  } catch (error: any) {
    console.error("Failed to get workspaces data: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getWorkspacesUpdatedAt;