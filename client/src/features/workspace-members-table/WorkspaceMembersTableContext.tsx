import { createContext } from 'react';

const WorkspaceMembersTableContext = createContext<{
  memberNames: string[]
} | null>(null);

export default WorkspaceMembersTableContext;