import { Request, Response } from "express";
import utils from '../utils';

interface Props {
  input: string;
}

const inferAgentType = async (req: Request, res: Response) => {
  const { input }: Props = req.body;

  try {
    const inferAgentType = await utils.inferAgentType(input);
    if (!inferAgentType) return utils.sendResponse(res, 503, "Failed to get response");

    res.status(200).json({
      message: "apiResponse created",
      data: inferAgentType
    });
    
  } catch (error) {
    console.error("Failed to get appropriate agent type: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default inferAgentType;