import { Response } from "express";

interface Props {
  res: Response;
  status: number;
  message: string;
}

const sendResponse = ({ res, status, message }: Props) => {
  res.status(status).json({
    message,
    data: null
  });
};

export default sendResponse;