import { Request, Response } from "express";

const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ userId: req.session.userId });
};

export default me;