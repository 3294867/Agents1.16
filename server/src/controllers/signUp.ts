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

const signUp = async (req: Request, res: Response) => {
  const { name, password }: Props = req.body;
  if (!name || !password) return sendResponse(res, 400, "Missing fields");

  try {
    const existingUserQueryText = `
      SELECT * FROM "User"
      WHERE "name" = $1::uuid;
    `;
    const existingUser = await pool.query(existingUserQueryText, [
      name
    ]);
    if (existingUser.rows.length > 0) return sendResponse(res, 409, "User exists");

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const resultQueryText = `
      INSERT INTO "User" ("name", "password")
      VALUES ($1, $2)
      RETURNING "id";
    `;
    const result = await pool.query(resultQueryText, [
      name,
      hashedPassword
    ]);
    if (result.rows.length === 0) return sendResponse(res, 503,"Failed to add user");

    const userId = result.rows[0].id;

    req.session.userId = userId;
    res.json({ success: true, userId})

  } catch (error) {
    console.error("Failed to create user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default signUp;