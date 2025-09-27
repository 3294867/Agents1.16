import { WorkspaceMember } from 'src/types';

interface Props {
  workspaceId: string;
}

const getWorkspaceMembers = async ({ workspaceId }: Props): Promise<WorkspaceMember[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-workspace-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch workspace members (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: WorkspaceMember[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (!Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Incorrect workspaceMembers format. Expected non-empty '[]'`);
    }
    
    return data.data as WorkspaceMember[];
  } catch (error) {
    throw new Error(`Failed to fetch workspaceMembers (PostgresDB): ${error}`);
  }
};

export default getWorkspaceMembers;