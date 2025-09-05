import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  agentId: string;
}

const getAgentUpdatedAt = async (req: Request, res: Response): Promise<void> => {
  const { agentId } = req.body as RequestBody;

  const validationError = utils.validate.getAgentUpdatedAt({ agentId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getAgentUpdatedAt = await pool.query(`
      SELECT updated_at
      FROM agents
      WHERE id = $1::uuid;
    `, [ agentId ]);
    if (getAgentUpdatedAt.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent updated at" });

    res.status(200).json({
      message: "Agent updatedAt fetched",
      data: getAgentUpdatedAt.rows[0].updated_at
    });
  } catch (error) {
    console.error("Failed to get agent updated at: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getAgentUpdatedAt;