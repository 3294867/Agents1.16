import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  userId: string;
  workspaceName: string;
  agentName: string;
}

const getAgentIdByName = async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceName, agentName }: RequestBody = req.body;

  const validationError = utils.validate.getAgentIdByName(userId, workspaceName, agentName);
  if (validationError) return utils.sendResponse(res, 404, validationError);

  try {
    /** Get workspace id */
    const selecetedWorkspaceIds = await pool.query(`SELECT workspace_id FROM workspace_user WHERE user_id = $1::uuid;`, [ userId ]);
    if (selecetedWorkspaceIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspaces ids");
    const mappedSelecetedWorkspaceIds = selecetedWorkspaceIds.rows.map((i: { workspace_id: string }) => i.workspace_id);

    const selectedWorkspaceId = await pool.query(`SELECT id FROM workspaces WHERE id = ANY($1::uuid[]) AND name = $2::text;`,[
      mappedSelecetedWorkspaceIds, workspaceName
    ]);
    if (selectedWorkspaceId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get workspace id");
    
    /** Get agent id*/
    const selectedAgentIds = await pool.query(`SELECT agent_id FROM workspace_agent WHERE workspace_id = $1::uuid;`, [
      selectedWorkspaceId.rows[0].id
    ]);
    if (selectedAgentIds.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent ids");
    const mappedSelectedAgentIds = selectedAgentIds.rows.map((i: { agent_id: string }) => i.agent_id);

    const selectedAgentId = await pool.query(`SELECT id FROM agents WHERE id = ANY($1::uuid[]) AND name = $2::text`, [
      mappedSelectedAgentIds, agentName
    ]);
    if (selectedAgentId.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get agent id");
    
    res.status(200).json({
      message: "Agent id fetched",
      data: { agentId: selectedAgentId.rows[0].id }
    });

  } catch (error: any) {
    console.error("Failed to fetch agent: ", error.stack || error);
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getAgentIdByName;