import { AgentType } from 'src/types';

interface Props {
  threadId: string;
}

const addPublicThread = async ({ threadId }: Props): Promise<{ agentType: AgentType, threadId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-public-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add public thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
  
    const data: { message: string, data: { agentType: AgentType, threadId: string } | null } = await response.json();
    if (!data.data) throw new Error('Failed to add public thread');
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect data format in postgresDB.addPublicThread(). Expected non-empty '{}`);
    }
    
    return data.data as { agentType: AgentType, threadId: string };
  } catch (error) {
    throw new Error(`Failed to add public thread (PostgresDB): ${error}`);
  }
};

export default addPublicThread;