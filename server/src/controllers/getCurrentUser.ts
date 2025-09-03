import { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.status(200).json({
    message: "User fetched",
    data: req.session.userId
  });
};

export default getCurrentUser;