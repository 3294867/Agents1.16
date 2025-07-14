import { Request, Response } from "express";
import { client } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface RequestType {
  question: string;
  answer: string;
};

const createThreadTitle = async (req: Request, res: Response) => {
  const { question, answer } = req.body as RequestType;

  try {
    const instructions = `Generate title for a below conversation. Make it short. Return only title.
      Question: ${question}
      Answet: ${answer}
    `;
    
    /** Create openai response */
    const apiResponse = await client.responses.create({
      model: 'gpt-4.1',
      input: instructions,
    });
    if (!apiResponse) return sendResponse(res, 503, "Failed to create thread title.");

    /** Send response to the client */
    res.status(200).json({
      message: "Thread title updated.",
      data: apiResponse.output_text
    });
    
  } catch (error) {
    console.error("Failed to create thread title: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default createThreadTitle;