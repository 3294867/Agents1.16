import { Request, Response } from "express";
import utils from '../utils';
import { pool } from '..';

interface RequestBody {
  userName: string;
  workspaceId: string;
}

const inviteUser = async (req: Request, res: Response) => {
  const { userName, workspaceId }: RequestBody = req.body

  const validationError = utils.validate.inviteUser({ userName, workspaceId });
  if (validationError) utils.sendResponse({ res, status: 400, message: validationError });
  
  try {
    await pool.query(`BEGIN`);
    
    const getUserId = await pool.query(`
      SELECT id
      FROM users
      WHERE name = $1::text; 
    `, [ userName ]);
    if (getUserId.rows.length === 0) utils.sendResponse({ res, status: 404, message: "Failed to fetch userId" });
    
    const getWorkspaceName = await pool.query(`
      SELECT name
      FROM workspaces
      WHERE id = $1::uuid;
    `, [workspaceId]);
    if (getWorkspaceName.rows.length === 0) utils.sendResponse({ res, status: 404, message: "Failed to fetch workspaceName" });

    const message = `You have been invited to join ${getWorkspaceName.rows[0].name} Workspace`;
    const details = {
      userId: getUserId.rows[0].id,
      userName,
      workspaceId,
      workspaceName: getWorkspaceName.rows[0].name
    }
    
    const addNotification = await pool.query(`
      INSERT INTO notifications (type, message, details)
      VALUES ('workspace_invite', $1::text, $2::jsonb)
      RETURNING id;
    `, [message, JSON.stringify(details)]);
    if (addNotification.rows.length === 0) utils.sendResponse({ res, status: 503, message: 'Failed to add notification' });

    const addUserNotification = await pool.query(`
      INSERT INTO user_notification (user_id, notification_id)
      VALUES ($1::uuid, $2::uuid)
      RETURNING user_id;
    `, [getUserId.rows[0].id, addNotification.rows[0].id]);
    if (addUserNotification.rows.length === 0) utils.sendResponse({ res, status: 503, message: 'Failed to add user_notification' });

    await pool.query(`COMMIT`);

    res.status(201).json({
      message: 'Notification added',
      data: addNotification.rows[0].id
    });
  } catch (err) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackError) {
      console.error(`Failed to rollback changes: ${rollbackError}`);
    }
    console.error(`Failed to add notification: ${err}`)
    utils.sendResponse({ res, status: 500, message: `Internal Server Error: ${err}` });
  }
};

export default inviteUser;