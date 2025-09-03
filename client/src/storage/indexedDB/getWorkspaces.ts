import { db } from './initialize';
import { Workspace } from 'src/types';

const getWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const getWorkspaces = await db.workspaces.toArray();
    return getWorkspaces;
  } catch (error) {
    throw new Error(`Failed to fetch workspaces (IndexedDB): ${error}`);
  }
};

export default getWorkspaces;