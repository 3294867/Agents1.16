import { createContext } from 'react';

const WorkspaceMembersTableContext = createContext<{
  workspaceId: string;
  workspaceName: string;
  memberNames: string[]
} | null>(null);

export default WorkspaceMembersTableContext;