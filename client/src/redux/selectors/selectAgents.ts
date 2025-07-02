import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { Agent } from 'src/types';

const selectAgents = createSelector(
  [
    (state: RootState) => state.api.queries,
  ],
  (queries) => {
    const queryData = Object.values(queries)
      .find((query) => query?.endpointName === 'getAgents' && query?.data)?.data as {
        byId: Record<string, Agent>;
        allIds: string[];
      };

    if (!queryData) {
      return {
        data: [],
        status: 'pending',
        error: null,
      };
    }

    const agents = Object.values(queryData.byId) as Agent[];

    return {
      data: agents,
      status: 'fulfilled',
      error: null,
    };
  }
);

export default selectAgents;