import { Response } from "express";

export const sendResponse = (res: Response, status: number, message: string, data: null = null) => {
  res.status(status).json({
    message,
    data
  });
};