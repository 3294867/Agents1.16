import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const createPool = (): Pool => {
  const poolConfig: PoolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,  
    port: Number(process.env.DB_API_ROUTES_PORT),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
  
  return new Pool(poolConfig);
};
