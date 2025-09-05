import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
  workspaceName: string;
}

const getWorkspaceId = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceName }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaceId({ userId, workspaceName });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
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
    
    res.status(200).json({
      message: "Workspace id fetched",
      data: getWorkspaceId.rows[0].id
    });
  } catch (error) {
    console.error("Failed to fetch workspace id: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getWorkspaceId;