import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface GetAgentProps {
  agentName: string | undefined;
  error: string | null;
  setError: (error: string | null) => void;
};

const getAgent = async (props: GetAgentProps): Promise<Agent | null> => {
  if (!props.agentName) {
    props.setError('Agent name is required');
    return null;
  }

  try {
    const agent = await db.agents.where('name').equals(props.agentName).first();
    if (!agent) return null;
    return agent;
  } catch (error) {
    console.error(error);
    props.setError(`IndexedDB error: ${error instanceof Error ? error.name : 'Unknown error'}`);
    return null;
  }
};

export default getAgent;