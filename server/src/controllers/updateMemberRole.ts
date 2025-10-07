import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  workspaceId: string;
  userId: string;
  role: string;
}

const updateMemberRole = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId, userId, role }: RequestBody = req.body;

  const validationError = utils.validate.updateMemberRole({ workspaceId, userId, role });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const updateMemberRole = await pool.query(`
      UPDATE workspace_user
      SET user_role = $1::text
      WHERE workspace_id = $2::uuid
        AND user_id = $3::uuid
      RETURNING workspace_id;
    `, [ role, workspaceId, userId ]);
    if (updateMemberRole.rows.length === 0) utils.sendResponse({ res, status: 503, message: 'Failed to update member role' });
    
    res.status(200).json({
      message: "Member role updated",
    });
    
  } catch (error) {
    console.error("Failed to update member role: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default updateMemberRole;