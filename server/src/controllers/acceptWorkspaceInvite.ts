import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  notificationId: string;
}

const acceptWorkspaceInvite = async (req: Request, res: Response): Promise<void> => {
  const { notificationId }: RequestBody = req.body;

  const validationError = utils.validate.acceptWorkspaceInvite({ notificationId });
  if (validationError) {
    utils.sendResponse({ res, status: 400, message: validationError });
    return;
  }

  try {
    await pool.query(`BEGIN`);
    
    const getNotification = await pool.query(`
      SELECT *
      FROM notifications
      WHERE id = $1::uuid;
    `, [ notificationId ]);
    if (getNotification.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      utils.sendResponse({ res, status: 404, message: "Failed to get notification" });
    }

    const addWorkspaceMember = await pool.query(`
      INSERT INTO workspace_user (workspace_id, user_id, user_role)
      VALUES ($1::uuid, $2::uuid, 'viewer')
      RETURNING workspace_id;
    `, [
      getNotification.rows[0].details.workspaceId,
      getNotification.rows[0].details.userId,
    ]);
    if (addWorkspaceMember.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      utils.sendResponse({ res, status: 503, message: "Failed to add workspace_user" });
    }

    const removeNotification = await pool.query(`
      DELETE
      FROM notifications
      WHERE id = $1::uuid
      RETURNING id;
    `, [ notificationId ]);
    if (removeNotification.rows.length === 0) {
      await pool.query(`ROLLBACK`);
      utils.sendResponse({ res, status: 503, message: "Failed to delete notification" });
    }

    await pool.query(`COMMIT`);
    
    res.status(200).json({
      message: 'Workspace invite accepted',
      data: addWorkspaceMember.rows[0].id
    });
  } catch (err) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackErr) {
      console.error(`Failed to rollback changes: ${rollbackErr}`)
    }
    console.error(`Failed to accept workspace invite: ${err}`);
    utils.sendResponse({ res, status: 500, message: `Internal Server Error: ${err}` });
  }
};

export default acceptWorkspaceInvite;