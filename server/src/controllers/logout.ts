import { Request, Response } from "express";

const logout = async (req: Request, res: Response): Promise<void> => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ success: true });
  });
};

export default logout;