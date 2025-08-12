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
    await pool.query("BEGIN"); 

    const existingUserQueryText = `
      SELECT * FROM "User"
      WHERE "name" = $1::text;
    `;
    const existingUser = await pool.query(existingUserQueryText, [
      name
    ]);
    if (existingUser.rows.length > 0) return sendResponse(res, 409, "User exists");

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserQueryText = `
      INSERT INTO "User" ("name", "password")
      VALUES ($1::text, $2::text)
      RETURNING "id";
    `;
    const newUser = await pool.query(newUserQueryText, [
      name,
      hashedPassword
    ]);
    if (newUser.rows.length === 0) return sendResponse(res, 503,"Failed to add user");
    const newUserId = newUser.rows[0].id;
    
    const newGeneralAgentTextQuery = `
      INSERT INTO "Agent" ( "id", "type", "model", "userId", "name", "systemInstructions", "stack", "temperature", "webSearch", "createdAt", "updatedAt" )
      VALUES ( gen_random_uuid(), 'general', 'gpt-3.5-turbo', $1::uuid, 'general', '', NULL, 0.5, TRUE, NOW(), NOW() );
    `;
    const newGeneralAgent = await pool.query(newGeneralAgentTextQuery, [newUserId])
    if (!newGeneralAgent) return sendResponse(res, 503, "Failed to add general agent");
    
    await pool.query("COMMIT");


    req.session.userId = newUserId;
    res.json({ success: true, userId: newUserId})

  } catch (error) {
    try {
      await pool.query("ROLLLBACK")
    } catch (error) {
      console.error("Rollback error: ", error);
    }
    console.error("Failed to create user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default signUp;