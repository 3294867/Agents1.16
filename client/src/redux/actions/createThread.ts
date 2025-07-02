import api from 'src/redux/api';
import { Thread } from 'src/types';
import tabsStorage from 'src/utils/localStorage/tabsStorage';

interface Request {
  id: string;
  userId: string;
  agent: string;
  agentId: string;
};

interface Response {
  message: string;
  data: Thread | null;
};

const createThread = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create thread.
     * 
     * @param {Object} body - The request payload
     * @param {string} body.id - Thread id
     * @param {string} body.userId - User id
     * @param {string} body.agentId - Agent id
     * @returns {Object} - Message and data object
    */
    createThread: builder.mutation<Response, Request>({
      query: (body) => {
        return {
          url: '/create-thread',
          method: 'POST',
          body: {
            id: body.id,
            userId: body.userId,
            agentId: body.agentId
          }
        }
      },
      async onQueryStarted(args, { queryFulfilled }) {
        const res = await queryFulfilled;
        const thread = res.data.data;
        if (!thread) return;

        const tabs = tabsStorage.load(args.agent);
        const newThread = {
          id: thread.id,
          userId: thread.userId,
          agentId: thread.agentId,
          title: thread.title,
          body: thread.body,
          isActive: true,
          isBookmarked: false,
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
        };

        if (tabs === null) {
          tabsStorage.save(args.agent, [newThread]);
        } else {
          const updatedTabs: Thread[] = [];
          for (const t of tabs) {
            if (t.agentId === args.agentId) {
              t.isActive = false;
            };
            updatedTabs.push(t);
          };
          
          tabsStorage.save(args.agent, [...updatedTabs, newThread]);

          
        }
      }
    }),
  })
});

export const { useCreateThreadMutation } = createThread;

export default createThread;