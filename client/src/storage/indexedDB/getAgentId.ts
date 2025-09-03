import { db } from './initialize';

interface Props {
  workspaceId: string | undefined;
  agentName: string | undefined;
}

const getAgentId = async ({ workspaceId, agentName }: Props): Promise<string | undefined> => {
  if (!workspaceId || !agentName) {
    throw new Error('All props are required: workspaceId, agentName');
  }

  try {
    const agent = await db.agents.get({workspaceId, name: agentName});
    if (!agent) throw new Error('Failed to fetch agentId (IndexedDB)');
    return agent.id;
  } catch (error) {
    throw new Error(`Failed to fetch agentId (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getAgentId;