import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { Agent } from 'src/types';

const selectAgentId = createSelector(
    [
      (state: RootState) => state.api.queries,
      (_: RootState, agent: string) => agent
    ],
    (queries, agent) => {
    const queryData = Object.values(queries)
      .find((query) => query?.endpointName === 'getAgents' && query?.data)?.data as {
        byId: Record<string, Agent>;
        allIds: string[];
      };

    if (!queryData) return {
      data: null,
      status: 'pending',
      error: null,
    };

    const agents = Object.values(queryData.byId) as Agent[];
    const agentId = agents.filter(a => a.name === agent)[0].id;

    return {
      agentId: agentId,
      status: 'fulfilled',
      error: null,
    };
  }
);

export default selectAgentId;