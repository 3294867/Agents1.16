import { Request, Response } from "express";
import { client } from "../index";
import utils from '../utils';

interface RequestBody {
  question: string;
  answer: string;
}

const createThreadName = async (req: Request, res: Response): Promise<void> => {
  const { question, answer }: RequestBody = req.body;

  const validationError = utils.validate.createThreadTitle({ question, answer });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });
  
  try {
    const apiResponse = await client.responses.create({
      model: 'gpt-3.5-turbo',
      input: `Return only short title for the following conversation: Question: ${question}; Answer: ${answer}.`,
    });
    if (!apiResponse.output_text) return utils.sendResponse({ res, status: 503, message: "Failed to create thread name" });

    res.status(200).json({
      message: "Thread name created",
      data: apiResponse.output_text
    });
  } catch (error) {
    console.error("Failed to create thread name: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createThreadName;