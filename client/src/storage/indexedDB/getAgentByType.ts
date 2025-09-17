import { db } from './initialize';
import { Agent, AgentType } from 'src/types';

interface Props {
  agentType: AgentType;
}

const getAgentByType = async ({ agentType }: Props): Promise<Agent | null> => {
  try {
    const agent = await db.agents.get({type: agentType});
    if (agent) return agent;
    return null;
  } catch (err) {
    console.error(`Failed to fetch agent (IndexedDB): ${err}`);
    return null;
  }
};

export default getAgentByType;