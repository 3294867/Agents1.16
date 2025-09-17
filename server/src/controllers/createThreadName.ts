import { Request, Response } from "express";
import { client } from "../index";
import utils from '../utils';

interface RequestBody {
  question: string;
  answer: string;
}

const createThreadName = async (req: Request, res: Response): Promise<void> => {
  const { question, answer }: RequestBody = req.body;

  const validationError = utils.validate.createThreadName({ question, answer });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });
  
  try {
    const apiResponse = await client.responses.create({
      model: 'gpt-4.1-nano',
      input: `
        Return a short, clear title for the following conversation.
        Question: ${question}
        Answer: ${answer}

        Rules:
        - Output only the title.
        - Do not use quotes ("").
        - Do not include "Title:", or extra words.
        - The output must be in this format: Location of Malta
      `,
    });
    if (!apiResponse.output_text) return utils.sendResponse({ res, status: 503, message: "Failed to create thread name" });

    let threadName = apiResponse.output_text;
    if (apiResponse.output_text.startsWith("Title: ")) {
      threadName = apiResponse.output_text.slice(7);
    } else if (apiResponse.output_text[0] === `"` && apiResponse.output_text[apiResponse.output_text.length - 1] === `"`) {
      threadName.slice(1, apiResponse.output_text.length - 2);
    }

    res.status(200).json({
      message: "Thread name created",
      data: threadName
    });
  } catch (error) {
    console.error("Failed to create thread name: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createThreadName;