import { Request, Response } from "express";
import { client } from "../index";
import utils from '../utils';
import { AgentModel } from '../types';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

interface RequestBody {
  agentId: string;
  input: string;
  agentModel?: AgentModel;
}

const createStructuredResponse = async (req: Request, res: Response): Promise<void> => {
  const { agentId, input, agentModel }: RequestBody = req.body;

  const validationError = await utils.validate.createStructuredResponse({ agentId, input, agentModel });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const TableRow = z.object({
      year: z.string(),
      name: z.string()
    });

    const Table = z.object({ rows: z.array(TableRow) });
    
    const apiResponse = await client.responses.parse({
      model: "gpt-4o",
      input: [
        { role: "system", content: "Extract data for each row." },
        {
          role: "user",
          content: "Return US Open winners from 2000 until last available result. Attributes: year, winner.",
        },
      ],
      text: {
        format: zodTextFormat(Table, "rows")
      }
    });

    res.status(201).json({
      message: "Response created",
      data: apiResponse.output_parsed
    });
  } catch (error) {
    console.error("Failed to create structured response: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createStructuredResponse;