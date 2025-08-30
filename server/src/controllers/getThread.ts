import { Request, Response } from "express";
import { pool } from "../index";
import utils from '../utils';
import { QueryJS, QueryPG, ThreadJS } from '../types';

interface RequestBody {
  threadId: string;
}

const getThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = utils.validate.getThread(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const selectedThread = await pool.query(`SELECT * FROM threads WHERE id = $1::uuid;`, [ threadId ]);
    if (selectedThread.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch thread");

    const mappedThread: ThreadJS = {
      id: selectedThread.rows[0].id,
      name: selectedThread.rows[0].name,
      body: selectedThread.rows[0].body.map((i: QueryPG) => {
        return {
          requestId: i.request_id,
          requestBody: null,
          responseId: i.response_id,
          responseBody: null,
          inferredAgentType: null,
          isNew: false
        };
      }),
      isBookmarked: selectedThread.rows[0].is_bookmarked,
      isShared: selectedThread.rows[0].is_shared,
      createdAt: selectedThread.rows[0].created_at,
      updatedAt: selectedThread.rows[0].updated_at
    };

    const bodyWithDetails = await Promise.all(
      mappedThread.body.map(async (i: QueryJS) => {
        const selectedRequestBody = await pool.query(`SELECT body FROM requests WHERE id = $1::uuid;`, [ i.requestId ]);
        if (selectedRequestBody.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch request body");
        
        const inferredAgentType = await utils.inferAgentType(selectedRequestBody.rows[0].body);
        if (!inferredAgentType) return utils.sendResponse(res, 503, "Failed to infer agent type");
        
        const selectedResponseBody = await pool.query(`SELECT body FROM responses WHERE id = $1::uuid;`, [ i.responseId ]);
        if (selectedResponseBody.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch response body");

        return {
          requestId: i.requestId,
          requestBody: selectedRequestBody.rows[0].body,
          responseId: i.responseId,
          responseBody: selectedResponseBody.rows[0].body,
          inferredAgentType,
          isNew: false
        } as QueryJS
      })
    );

    mappedThread.body = bodyWithDetails as QueryJS[];

    res.status(200).json({
      message: "Thread fetched",
      data: { thread: mappedThread }
    });
  } catch (error: any) {
    console.error("Failed to fetch thread: ", error.stack || error );
    utils.sendResponse(res, 500, "Internal server error");
  }
}

export default getThread;