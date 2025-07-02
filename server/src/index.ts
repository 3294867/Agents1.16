import express from "express";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Router from "./route";
import { createPool } from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

/** Connect database */
export const pool = createPool();
pool.connect((err, _, release) => {
  if (err) {
    return console.error("Error acquiring client.", err.stack);
  }
  console.debug("Database connected successfully.");
  release();
});

/** Connect OpenAI */
export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/** Connect API routes */
app.use("/api", Router);

/** Listen to api routes  */
app.listen(process.env.API_ROUTES_PORT, () => {
  try {
    console.debug(`Listening to api routes running on port ${process.env.API_ROUTES_PORT}.`);
  } catch (error) {
    console.error("Listening to api routes startup error: ", error);
  }
});
