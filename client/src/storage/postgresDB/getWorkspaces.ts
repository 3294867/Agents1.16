import { Workspace } from 'src/types';

interface Props {
  userId: string;
}

const getWorkspaces = async ({ userId }: Props): Promise<Workspace[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch workspaces (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Workspace[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (!Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Incorrect workspaces format. Expected non-empty '[]'`);
    }
    
    return data.data as Workspace[];
  } catch (error) {
    throw new Error(`Failed to fetch workspaces (PostgresDB): ${error}`);
  }
};

export default getWorkspaces;