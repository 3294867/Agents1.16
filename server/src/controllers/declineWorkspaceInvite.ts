import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  notificationId: string;
}

const declineWorkspaceInvite = async (req: Request, res: Response): Promise<void> => {
  const { notificationId }: RequestBody = req.body;

  const validationError = utils.validate.declineWorkspaceInvite({ notificationId });
  if (validationError) utils.sendResponse({ res, status: 400, message: validationError });

  try {
    await pool.query(`BEGIN`);
    
    const removeNotification = await pool.query(`
      DELETE
      FROM notifications
      WHERE id = $1::uuid
      RETURNING id;
    `, [ notificationId]);
    if (removeNotification.rows.length === 0) utils.sendResponse({ res, status: 503, message: "Failed to delete notification" });

    const removeUserNotification = await pool.query(`
      DELETE
      FROM user_notification
      WHERE notification_id = $1::uuid;
    `, [ notificationId ]);
    if (removeUserNotification.rows.length === 0) utils.sendResponse({ res, status: 503, message: "Failed to delete user_notification" });

    await pool.query(`COMMIT`);

    res.status(200).json({
      message: 'Workspace invite declined',
      data: removeNotification.rows[0].id
    });
  } catch (err) {
    try {
      await pool.query(`ROLLBACK`);
    } catch (rollbackErr) {
      console.error(`Failed to rollback changes: ${rollbackErr}`)
    }
    console.error(`Failed to fetch notifications: ${err}`);
    utils.sendResponse({ res, status: 500, message: `Internal Server Error: ${err}` });
  }
};

export default declineWorkspaceInvite;