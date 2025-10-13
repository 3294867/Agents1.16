import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { WorkspaceFE } from '../types';

interface RequestBody {
  userId: string;
}

const getWorkspaces = async (req: Request, res: Response): Promise<void> => {
  const { userId }: RequestBody = req.body;

  const validationError = utils.validate.getWorkspaces({ userId });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getWorkspaces = await pool.query(`
      SELECT 
        w.id,
        w.name,
        w.description,
        w.created_at,
        w.updated_at,
        wu.user_role,
        COALESCE(
          array_agg(wa.agent_id) FILTER (WHERE wa.agent_id IS NOT NULL), '{}'
        ) AS agent_ids
      FROM workspaces w
      JOIN workspace_user wu
        ON w.id = wu.workspace_id
      LEFT JOIN workspace_agent wa
        ON w.id = wa.workspace_id
      WHERE wu.user_id = $1::uuid
      GROUP BY w.id, wu.user_role
      ORDER BY w.created_at DESC;
    `, [ userId ]);
    if (getWorkspaces.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get workspaces" });

    const workspaces: WorkspaceFE[] = [];
    for (const item of getWorkspaces.rows) {
      let workspaceName;
      if (item.name === 'personal' || item.name === 'incognito') {
        workspaceName = item.name;
      } else {
        workspaceName = item.name + "-" + item.id.slice(item.id.length - 5, item.id.length - 1);
      }
      
      const workspace: WorkspaceFE = {
        id: item.id,
        name: workspaceName,
        description: item.description,
        userRole: item.user_role,
        agentIds: item.agent_ids,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
      workspaces.push(workspace);
    }

    res.status(200).json({
      message: "Workspaces fetched",
      data: workspaces
    });
  } catch (error) {
    console.error("Failed to fetch workspaces: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default getWorkspaces;