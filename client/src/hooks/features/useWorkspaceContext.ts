import { useContext } from 'react';
import WorkspaceContext from 'src/features/workspace/WorkspaceContext';

const useWorkspaceContext = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspaceContext must be within a Workspace');
  return ctx;
};

export default useWorkspaceContext;