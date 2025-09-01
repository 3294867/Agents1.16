import { db } from 'src/storage/indexedDB';
import { WorkspaceFE } from 'src/types';

interface Props {
  workspaces: WorkspaceFE[];
}

const addWorkspaces = async ({ workspaces }: Props): Promise<void> => {
  try {
    await db.workspaces.bulkPut(workspaces);
  } catch (error) {
    console.error('Failed to add workspaces (IndexedDB): ', error);
  }
};

export default addWorkspaces;