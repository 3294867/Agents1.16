import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  agentName: string | undefined;
  setError: (error: string | null) => void;
};

/**
 * Fetches specific agent (IndexedDB).
 * @param {string | undefined} props.agentName - Agent name property of a specific agent.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setError - Setter function of a useState hook.  
 * @returns {Promise<Agent | null>} - Returns Agent or null.
 */
const getAgent = async ({ agentName, setError }: Props): Promise<Agent | null> => {
  if (!agentName) {
    setError('Agent name is required');
    return null;
  }

  try {
    const agent = await db.agents.where('name').equals(agentName).first();
    if (!agent) return null;
    return agent;
    
  } catch (error) {
    console.error(error);
    setError(`Failed to fetch agent (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
    return null;
  }
};

export default getAgent;