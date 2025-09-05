import bcrypt from "bcrypt";
import { pool } from "../index";

const updateSeedPasswords = async () => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash("password", saltRounds);
  await pool.query(`
    UPDATE users
    SET password = $1::text
    WHERE name IN ($2::text, $3::text, $4::text);
  `, [hashedPassword, "root", "test", "test2"]);
};

export default updateSeedPasswords;