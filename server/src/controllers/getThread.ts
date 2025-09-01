import { Request, Response } from "express";
import { client, pool } from "../index";
import utils from '../utils';
import { ReqResBE, ReqResPG, ThreadBE } from '../types';

interface RequestBody {
  threadId: string;
}

const getThread = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.body as RequestBody;

  const validationError = utils.validate.getThread(threadId);
  if (validationError) return utils.sendResponse(res, 400, validationError);

  try {
    const getThread = await pool.query(`
      SELECT *
      FROM threads
      WHERE id = $1::uuid;
    `, [ threadId ]);
    if (getThread.rows.length === 0) return utils.sendResponse(res, 404, "Failed to fetch thread");

    const mappedThread: ThreadBE = {
      id: getThread.rows[0].id,
      name: getThread.rows[0].name,
      body: getThread.rows[0].body.map((i: ReqResPG) => {
        return {
          requestId: i.request_id,
          requestBody: null,
          responseId: i.response_id,
          responseBody: null,
          inferredAgentType: null,
          isNew: false
        };
      }),
      isBookmarked: getThread.rows[0].is_bookmarked,
      isShared: getThread.rows[0].is_shared,
      createdAt: getThread.rows[0].created_at,
      updatedAt: getThread.rows[0].updated_at
    };

    const bodyWithDetails = await Promise.all(
      mappedThread.body.map(async (i: ReqResBE) => {
        const getRequestBody = await pool.query(`
          SELECT body
          FROM requests
          WHERE id = $1::uuid;
        `, [ i.requestId ]);
        if (getRequestBody.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get request body");
        
        const inferAgentType = await client.responses.create({
          model: "gpt-3.5-turbo",
          input: `
            Choose the most appropriate agent type for the following question: ${getRequestBody.rows[0].body}.
            Available agent types: 'general_assistant', 'data_analyst', 'copywriter', 'devops_helper'.
            Return only agent type in lower case.
          `,
        });
        if (!inferAgentType.output_text) return utils.sendResponse(res, 503, "Failed to infer agent type");
        
        const getResponseBody = await pool.query(`
          SELECT body
          FROM responses
          WHERE id = $1::uuid;
        `, [ i.responseId ]);
        if (getResponseBody.rows.length === 0) return utils.sendResponse(res, 404, "Failed to get response body");

        return {
          requestId: i.requestId,
          requestBody: getRequestBody.rows[0].body,
          responseId: i.responseId,
          responseBody: getResponseBody.rows[0].body,
          inferredAgentType: inferAgentType.output_text,
          isNew: false
        } as ReqResBE
      })
    );

    mappedThread.body = bodyWithDetails as ReqResBE[];

    res.status(200).json({
      message: "Thread fetched",
      data: { thread: mappedThread }
    });
  } catch (error: any) {
    console.error("Failed to fetch thread: ", error.stack || error );
    utils.sendResponse(res, 500, "Internal server error");
  }
};

export default getThread;