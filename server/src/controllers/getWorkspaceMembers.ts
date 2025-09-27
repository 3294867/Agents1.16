import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  workspaceId: string;
}

const getWorkspaceMembers = async (req: Request, res: Response): Promise<void> => {
  const { workspaceId }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaceMembers({ workspaceId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const gettingWorkspaceMembers = await pool.query(`
      SELECT
        wu.user_id AS "memberId",
        u.name AS "memberName",
        wu.user_role AS "memberRole"
      FROM workspace_user wu
      JOIN users u
        ON wu.user_id = u.id
      WHERE workspace_id = $1::uuid;
    `, [ workspaceId ]);
    if (gettingWorkspaceMembers.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to fetch member ids" });
    
    res.status(201).json({
      message: 'Workspace members fetched',
      data: gettingWorkspaceMembers.rows
    })

  } catch (err) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackErr) {
      console.error('Rollback error: ', rollbackErr);
    }
    console.error("Failed to add agent: ", err);
    utils.sendResponse({ res, status: 500, message: `Internal server error: ${err}` });
  }
};

export default getWorkspaceMembers;