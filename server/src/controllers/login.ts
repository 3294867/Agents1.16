import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";
import bcrypt from "bcrypt";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

interface Props {
  name: string;
  password: string;
}

const login = async (req: Request, res: Response) => {
  const { name, password }: Props = req.body;
  if (!name || !password) return sendResponse(res, 400, "Missing fields");

  try {
    const resultQueryText = `
      SELECT * FROM "User"
      WHERE "name" = $1::uuid;
    `;
    const result = await pool.query(resultQueryText, [
      name,
    ]);
    if (result.rows.length === 0) return sendResponse(res, 401,"Invalid credentails");

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendResponse(res, 401, "Invalid credentials");

    req.session.userId = user.id;
    res.json({ success: true, userId: user.id})

  } catch (error) {
    console.error("Failed to login: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default login;