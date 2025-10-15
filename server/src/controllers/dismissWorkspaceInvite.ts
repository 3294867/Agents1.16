import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  notificationId: string;
}

const dismissWorkspaceInvite = async (req: Request, res: Response): Promise<void> => {
  const { notificationId }: RequestBody = req.body;

  const validationError = utils.validate.dismissWorkspaceInvite({ notificationId });
  if (validationError) utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const removeNotification = await pool.query(`
      DELETE
      FROM notifications
      WHERE id = $1::uuid
      RETURNING id;
    `, [ notificationId]);
    if (removeNotification.rows.length === 0) utils.sendResponse({ res, status: 503, message: "Failed to delete notification" });

    res.status(200).json({
      message: 'Workspace invite dismissed',
      data: removeNotification.rows[0].id
    });
  } catch (err) {
    console.error(`Failed to dismiss workspace invite: ${err}`);
    utils.sendResponse({ res, status: 500, message: `Internal Server Error: ${err}` });
  }
};

export default dismissWorkspaceInvite;