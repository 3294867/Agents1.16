import { db } from 'src/storage/indexedDB';
import { WorkspaceFE } from 'src/types';

const getWorkspaces = async (): Promise<WorkspaceFE[]> => {
  try {
    const getWorkspaces = await db.workspaces.toArray();
    return getWorkspaces;
  } catch (error) {
    throw new Error(`Failed to fetch workspaces (IndexedDB): ${error}`);
  }
};

export default getWorkspaces;