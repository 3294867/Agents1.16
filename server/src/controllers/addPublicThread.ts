import { Request, Response } from "express";
import { pool } from "../index";
import { sendResponse } from "../utils/sendResponse";

interface Props {
  threadId: string;
}

const addPublicThread = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    await pool.query("BEGIN");
    const getThreadQueryText = `
      SELECT * FROM "Thread" WHERE "id" = $1::uuid;
    `;
    const getThread = await pool.query(getThreadQueryText, [ threadId ]);
    if (!getThread) sendResponse(res, 404, "Failed to get thread");
    const thread = getThread.rows[0];

    const getRootUserQueryText = `
      SELECT "userId" FROM "User" WHERE "name" = 'Root'::text;
    `;
    const getRootUser = await pool.query(getRootUserQueryText);
    if (!getRootUser) sendResponse(res, 404, "Failed to get root user");
    const rootUserId = getRootUser.rows[0].userId;

    const getGeneralAgentIdQueryText = `
      SELECT "id" FROM "Agent" WHERE "userId" = $1::uuid;
    `;
    const getGeneralAgentId = await pool.query(getGeneralAgentIdQueryText, [
      rootUserId
    ]);
    if (!getGeneralAgentId) sendResponse(res, 404, "Failed to get general agent id");
    const generalAgentId = getGeneralAgentId.rows[0].id;

    const addPublicThreadQueryText = `
      INSERT INTO "Thread" (
        "userId",
        "agentId",
        "title",
        "body"
      )
      SELECT (
        $1::uuid,
        $2::uuid,
        $3::text,
        $4::jsnob
      );
      RETURNING "id";
    `;
    const addPublicThread = await pool.query(addPublicThreadQueryText, [
      rootUserId,
      generalAgentId,
      thread.title,
      JSON.stringify(thread.body)
    ]);
    if (!addPublicThread) sendResponse(res, 503, "Failed to add public thread");
    const publicThreadId = addPublicThread.rows[0].id;
    
    await pool.query("COMMIT");

    res.status(200).json({
      message: "Public thread added",
      data: publicThreadId
    });

  } catch (error) {
    try {
      await pool.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error: ", rollbackError);
    }
    console.error("Failed to add public thread.: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default addPublicThread;