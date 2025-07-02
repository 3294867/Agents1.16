import api from 'src/redux/api';
import { Thread } from 'src/types';

interface Request {
  id: string;
  userId: string;
  agentId: string;
};

interface Response {
  message: string;
  data: Thread | null;
};

const loadThread = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Load thread.
     * 
     * @param {Object} body - The request payload
     * @param {string} body.id - Thread id
     * @param {string} body.userId - User id
     * @param {string} body.agentId - Agent id
     * @returns {Object} - Message and data object
    */
    loadThread: builder.mutation<Response, Request>({
      query: (body) => {
        return {
          url: '/load-thread',
          method: 'POST',
          body: { threadId: body.id }
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const thread = res.data.data;
        if (!thread) return;
        
        /** Populate getThreads */
        dispatch(api.util.patchQueryData(
          'getThreads',
          { userId: args.userId, agentId: args.agentId },
          [
            { op: 'add', path: ['byId', thread.id], value: thread },
            { op: 'add', path: ['allIds', '-'], value: thread.id }
          ]
        ));
      }
    }),
  })
})

export const { useLoadThreadMutation } = loadThread;

export default loadThread;
