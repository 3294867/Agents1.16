import { db } from './initialize';

interface Props {
  workspaceName: string | undefined;
}

const getWorkspaceId = async ({ workspaceName }: Props): Promise<string> => {
  if (!workspaceName) throw new Error('All props are required: workspaceName');

  try {
    const workspace = await db.workspaces.where('name').equals(workspaceName).first();
    if (!workspace) throw new Error(`Failed to fetch workspaceId (IndexedDB)`);
    return workspace.id;
  } catch (error) {
    throw new Error(`Failed to fetch workspaceId (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getWorkspaceId;