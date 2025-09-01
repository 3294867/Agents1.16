import { Request, Response } from "express";
import utils from '../utils';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.session.userId) {
      return utils.sendResponse(res, 401, "Unauthorized");
    }
    res.status(200).json({
      message: "User fetched",
      data: { userId: req.session.userId }
    });
  } catch (error: any) {
    console.error("Failed to get current user: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getCurrentUser;