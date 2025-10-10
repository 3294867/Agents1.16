import { Request, Response } from "express";
import { pool } from '..';
import utils from '../utils';

interface RequestBody {
  userId: string;
}

const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const { userId }: RequestBody = req.body;

  const validationError = utils.validate.getNotifications({ userId });
  if (validationError) utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getUserNotifications = await pool.query(`
      SELECT notification_id
      FROM user_notification
      WHERE user_id = $1::uuid;
    `, [ userId ]);

    const notificationIds = getUserNotifications.rows.map((i: { notification_id: string }) => i.notification_id);

    const getNotifications = await pool.query(`
      SELECT *
      FROM notifications
      WHERE id = ANY($1::uuid[]);  
    `,[ notificationIds ]);

    res.status(200).json({
      message: 'Notifications fetched',
      data: getNotifications.rows
    });
  } catch (err) {
    console.error(`Failed to fetch notifications: ${err}`);
    utils.sendResponse({ res, status: 500, message: `Internal Server Error: ${err}` });
  }
};

export default getNotifications;