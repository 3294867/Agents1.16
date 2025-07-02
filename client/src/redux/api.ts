import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NormalizedAgents, Thread } from 'src/types';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  endpoints: (builder) => ({
    getAgents: builder.query<NormalizedAgents | null, { userId: string }>({
      query: (body) => {
        return {
          url: '/get-agents',
          method: 'POST',
          body
        }
      },
      transformResponse: (response: { message: string; data: NormalizedAgents | null }) => {
        return response.data;
      },
    }),
    getThread: builder.query<Thread | null, { threadId: string }>({
      query: (body) => {
        return {
          url: '/get-thread',
          method: 'POST',
          body
        }
      },
      transformResponse: (response: { message: string; data: Thread | null }) => {
        return response.data;
      },
    }),
  })
});

export const {
  useGetAgentsQuery,
  useGetThreadQuery
} = api;

export default api;