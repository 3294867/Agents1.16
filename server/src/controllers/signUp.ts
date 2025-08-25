import { Request, Response } from "express";
import { pool } from "../index";
import bcrypt from "bcrypt";
import utils from '../utils';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

interface Props {
  name: string;
  password: string;
  apiKey: string;
}

const signUp = async (req: Request, res: Response) => {
  const { name, password, apiKey }: Props = req.body;
  if (!name || !password) return utils.sendResponse(res, 400, "All fields are required: name, password, apiKey");

  try {
    await pool.query("BEGIN"); 

    const getExistingUser = await pool.query(`SELECT * FROM "User" WHERE "name" = $1::text;`, [ name ]);
    if (getExistingUser.rows.length > 0) return utils.sendResponse(res, 409, "User exists");

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const addNewUser = await pool.query(`
      INSERT INTO "User" (
        "name",
        "password",
        "apiKey"
      )
      SELECT
        $1::text,
        $2::text,
        $3::text
      RETURNING "id";
    `, [
      name,
      hashedPassword,
      apiKey
    ]);
    if (addNewUser.rows.length === 0) return utils.sendResponse(res, 503,"Failed to add user");
    
    const addGeneralAgent = await pool.query(`
      INSERT INTO "Agent" (
        "id",
        "type",
        "model",
        "userId",
        "name",
        "systemInstructions",
        "stack"
      )
      SELECT
        gen_random_uuid(),
        'general',
        'gpt-3.5-turbo',
        $1::uuid,
        'general',
        '',
        NULL
      RETURNING "id"
    `, [ addNewUser.rows[0].id ]);
    if (addGeneralAgent.rows.length === 0) return utils.sendResponse(res, 503, "Failed to add general agent");
    
    await pool.query("COMMIT");

    req.session.userId = addNewUser.rows[0].id;
    res.json({ success: true, userId: addNewUser.rows[0].id })

  } catch (error) {
    try {
      await pool.query("ROLLLBACK");
    } catch (error) {
      console.error("Rollback error: ", error);
    }
    console.error("Failed to create user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default signUp;