import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface Props {
  userId: string;
  workspaceName: string;
}

const getWorkspaceId = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceName }: Props = req.body;

  const validationError = utils.validate.getWorkspaceId(userId, workspaceName);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedWorkspaceIds = await pool.query(`SELECT workspace_id FROM workspace_user WHERE user_id = $1::uuid;`, [ userId ]);
    if (selectedWorkspaceIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces ids");
    const mappedSelectedWorkspaceIds = selectedWorkspaceIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const selectedWorkspaceId = await pool.query(`SELECT id FROM workspaces WHERE id = ANY($1::uuid[]) AND name = $2::text;`, [
      mappedSelectedWorkspaceIds, workspaceName
    ]);
    if (selectedWorkspaceId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch workspace id" );
    
    res.status(200).json({
      message: "Workspace id fetched",
      data: { workspaceId: selectedWorkspaceId.rows[0].id }
    });

  } catch (error: any) {
    console.error("Failed to fetch workspace id: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getWorkspaceId;