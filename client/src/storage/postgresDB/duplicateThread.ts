import { Thread } from 'src/types';

interface Props {
  workspaceId: string;
  agentId: string;
  publicThreadId: string;
}

interface Return {
  thread: Thread;
  agentName: string;
}

const duplicateThread = async ({ workspaceId, agentId, publicThreadId }: Props): Promise<Return> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/duplicate-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, publicThreadId, agentId })
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to duplicate thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
  
    const data: { message: string, data: { thread: Thread, agentName: string } | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data as { thread: Thread, agentName: string };
  } catch (error) {
    throw new Error(`Failed to duplicate thread (PostgresDB): ${error}`);
  }
};

export default duplicateThread;