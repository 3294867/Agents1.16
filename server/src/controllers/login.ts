import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import bcrypt from "bcrypt";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

interface RequestBody {
  name: string;
  password: string;
}

const login = async (req: Request, res: Response): Promise<void> => {
  const { name, password }: RequestBody = req.body;

  const validationError = utils.validate.login(name, password);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getUser = await pool.query(`
      SELECT *
      FROM users
      WHERE name = $1::text;
    `, [ name ]);
    if (getUser.rows.length === 0) return utils.sendResponse(res, 401,"Invalid name");
    
    const match = password === getUser.rows[0].password;
    if (!match) return utils.sendResponse(res, 401, "Invalid password");

    req.session.userId = getUser.rows[0].id;
    res.status(200).json({
      success: true,
      userId: getUser.rows[0].id
    });
  } catch (error) {
    console.error("Failed to login: ", error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default login;