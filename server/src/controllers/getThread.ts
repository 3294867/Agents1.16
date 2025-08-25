import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { Query, Thread } from '../types';

interface Props {
  threadId: string;
}

const getThread = async (req: Request, res: Response) => {
  const { threadId } = req.body as Props;

  try {
    const getThread = await utils.getThread(threadId);
    if (getThread.rows.length === 0) return utils.sendResponse(res, 404, "Thread not found");

    const adjustedThread: Thread = {
      id: getThread.rows[0].id,
      userId: getThread.rows[0].userId,
      agentId: getThread.rows[0].agentId,
      title: getThread.rows[0].title,
      body: getThread.rows[0].body.map((i: { requestId: string, responseId: string }) => ({
        requestId: i.requestId,
        responseId: i.responseId,
        requestBody: null,
        responseBody: null
      })),
      isBookmarked: getThread.rows[0].isBookmarked,
      createdAt: getThread.rows[0].createdAt,
      updatedAt: getThread.rows[0].updatedAt,
    };

    const getAgentType = await pool.query(`SELECT "type" FROM "Agent" WHERE "userId" = $1::uuid;`, [ getThread.rows[0].userId ]);
    if (getAgentType.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch agent type");

    const bodyWithDetails = await Promise.all(
      adjustedThread.body.map(async (query: Query) => {
        const getRequest = await pool.query(`SELECT "body" FROM "Request" WHERE "id" = $1::uuid`, [ query.requestId ]);
        if (getRequest.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch Request");

        const inferAgentType = await utils.inferAgentType(getRequest.rows[0].body);
        if (!inferAgentType) return utils.sendResponse(res, 503, "Failed to get response");

        const getResponse = await pool.query(`SELECT "body" FROM "Response" WHERE "id" = $1::uuid`, [ query.responseId ]);
        if (getResponse.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch Response");
        
        return {
          requestId: query.requestId,
          requestBody: getRequest.rows[0].body,
          responseId: query.responseId,
          responseBody: getResponse.rows[0].body,
          isNew: false,
          inferredAgentType: inferAgentType
        };
      })
    );

    getThread.rows[0].body = bodyWithDetails;

    res.status(200).json({
      message: "Thread fetched",
      data: getThread.rows[0]
    });
  } catch (error) {
    console.error("Failed to fetch thread: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getThread;