import express from "express";
import compression from "compression";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Router from "./route";
import { createPool } from "./db";
import { CustomPGSessionStore } from './sessionStore';
import utils from './utils';

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(compression());

export const pool = createPool();
pool.connect((err, _, release) => {
  if (err) return console.error("Error acquiring client.", err.stack);
  console.debug("Database connected successfully.");
  release();
});

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(session({
  store: new CustomPGSessionStore(),
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }
}));

app.use("/api", Router);

app.listen(process.env.API_ROUTES_PORT, () => {
  try {
    console.debug(`Listening to api routes running on port ${process.env.API_ROUTES_PORT}.`);
  } catch (error) {
    console.error("Listening to api routes startup error: ", error);
  }
});

utils.updateSeedPasswords();