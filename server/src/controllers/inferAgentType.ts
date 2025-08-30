import { Request, Response } from "express";
import utils from '../utils';

interface RequestBody {
  input: string;
}

const inferAgentType = async (req: Request, res: Response): Promise<void> => {
  const { input }: RequestBody = req.body;

  const validationError = utils.validate.inferAgentType(input);
  if (!validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const apiResponse = await utils.inferAgentType(input);
    if (!apiResponse) return utils.sendResponse(res, 503, "Failed to fetch appropriate agent type");

    res.status(200).json({
      message: "apiResponse created",
      data: { response: apiResponse }
    });
    
  } catch (error: any) {
    console.error("Failed to fetch appropriate agent type: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default inferAgentType;