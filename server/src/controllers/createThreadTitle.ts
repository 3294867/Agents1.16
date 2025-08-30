import { Request, Response } from "express";
import { client } from "../index";
import utils from '../utils';

interface RequestBody {
  question: string;
  answer: string;
}

const createThreadTitle = async (req: Request, res: Response): Promise<void> => {
  const { question, answer }: RequestBody = req.body;

  const validationError = utils.validate.createThreadTitle(question, answer);
  if (validationError) return utils.sendResponse(res, 400, validationError);
  
  try {
    const apiResponse = await client.responses.create({
      model: 'gpt-3.5-turbo',
      input: `Return only short title for the following conversation: Question: ${question}; Answer: ${answer}.`,
    });
    if (!apiResponse.output_text) return utils.sendResponse(res, 503, "Failed to create thread title");

    res.status(200).json({
      message: "Thread title created",
      data: { response: apiResponse.output_text }
    });
  } catch (error: any) {
    console.error("Failed to create thread title: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default createThreadTitle;