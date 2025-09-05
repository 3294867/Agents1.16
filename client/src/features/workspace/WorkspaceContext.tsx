import { createContext } from 'react';
import { Workspace } from 'src/types';

interface WorkspaceContextType {
  userId: string;
  workspaceName: string;
  workspaces: Workspace[];
  isMobile: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;