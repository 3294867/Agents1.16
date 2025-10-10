import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  input: string;
}

const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { input }: RequestBody = req.body;

  const validationError = utils.validate.getUsers({ input });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getUsers = await pool.query(`
      SELECT name
      FROM users
      WHERE name LIKE $1::text;
    `, [ input + '%' ]);

    const users = getUsers.rows.map((i: { name: string }) => i.name);

    res.status(200).json({
      message: "Users fetched",
      data: users
    });
  } catch (error) {
    console.error("Failed to fetch users: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getUsers;