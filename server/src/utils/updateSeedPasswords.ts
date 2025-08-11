import bcrypt from "bcrypt";
import { pool } from "../index";

const updateSeedPasswords = async () => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash("password", saltRounds);
  await pool.query('UPDATE "User" SET "password" = $1 WHERE "name" IN ($2, $3)', [hashedPassword, "Root", "Test"]);
};

export default updateSeedPasswords;