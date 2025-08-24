import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
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

  try {
    if (!name) return utils.controllers.sendResponse(res, 400, "Name is required");
    
    const getUser = await pool.query(`SELECT * FROM "User" WHERE "name" = $1::text;`, [
      name,
    ]);
    if (getUser.rows.length === 0) return utils.controllers.sendResponse(res, 401,"Invalid name");
    
    if (!password) return utils.controllers.sendResponse(res, 400, "Password is required");

    const match = await bcrypt.compare(password, getUser.rows[0].password);
    if (!match) return utils.controllers.sendResponse(res, 401, "Invalid password");

    req.session.userId = getUser.rows[0].id;
    res.status(200).json({
      success: true,
      userId: getUser.rows[0].id
    });

  } catch (error) {
    console.error("Failed to login: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default login;