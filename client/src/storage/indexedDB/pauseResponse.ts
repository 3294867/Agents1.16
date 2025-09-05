import { db } from './initialize';
import { AgentType } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

/** Updates reqres on pause (IndexedDB) */
const pauseResponse = async ({ threadId, requestId, responseBody, inferredAgentType }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    const threadBodyArray = Array.isArray(savedThread?.body) ? savedThread.body : [];
    if (!savedThread) throw new Error('Thread not found');

    const savedReqRes = threadBodyArray.find(q => q.requestId === requestId);
    if (!savedReqRes) throw new Error('Reqres not found')
      
    const updatedReqRes = {
      requestId: savedReqRes.requestId,
      requestBody: savedReqRes.requestBody,
      responseId: savedReqRes.responseId,
      responseBody,
      isNew: false,
      inferredAgentType
    };

    const filteredThreadBodyArray = threadBodyArray.filter(q => q.requestId !== requestId);
      
    const updatedThread = await db.threads.update(threadId, {
      body: [...filteredThreadBodyArray, updatedReqRes]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread');


  } catch (error) {
    console.error('Failed to add reqres (IndexedDB): ', error);
  }
};

export default pauseResponse;