import { db } from './initialize';
import { Agent, AgentType } from 'src/types';

interface Props {
  userId: string;
  agentType: AgentType;
}

const getAgentByType = async ({ userId, agentType }: Props): Promise<Agent | undefined> => {
  try {
    const agent = await db.agents.get({userId, type: agentType});
    return agent;
  } catch (error) {
    throw new Error(`Failed to fetch agent (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getAgentByType;