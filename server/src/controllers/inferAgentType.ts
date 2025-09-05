import { Request, Response } from "express";
import { client } from '..';
import utils from '../utils';

interface RequestBody {
  input: string;
}

const inferAgentType = async (req: Request, res: Response): Promise<void> => {
  const { input }: RequestBody = req.body;

  const validationError = utils.validate.inferAgentType({ input });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
  const inferAgentType = await client.responses.create({
    model: "gpt-3.5-turbo",
    input: `
      Choose the most appropriate agent type for the following question: ${input}.
      Available agent types: 'general', 'data-analyst', 'copywriter', 'devops-helper'.
      Return only agent type in lower case.
    `,
  });
  if (!inferAgentType.output_text) return utils.sendResponse({ res, status: 503, message: "Failed to infer agent type" });
    
  res.status(200).json({
    message: "Agent type inferred",
    data: inferAgentType.output_text
  });
  } catch (error) {
    console.error("Failed to infer agent type: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default inferAgentType;