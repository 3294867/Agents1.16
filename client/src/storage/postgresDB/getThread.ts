import { Thread } from 'src/types';

interface Props {
  threadId: string;
}

const getThread = async ({ threadId }: Props): Promise<Thread> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Thread | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data;

  } catch (error) {
    throw new Error(`Failed to fetch thread (PostgresDB): ${error}`);
  }
};

export default getThread;