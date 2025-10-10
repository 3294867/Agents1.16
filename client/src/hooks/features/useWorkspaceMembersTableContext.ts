import { useContext } from 'react'
import WorkspaceMembersTableContext from 'src/features/workspace-members-table/WorkspaceMembersTableContext'

const useWorkspaceMembersTableContext = () => {
  const ctx = useContext(WorkspaceMembersTableContext);
  if (!ctx) throw new Error('useWorkspaceMembersTableContext must be used within WorkspaceMembersTable');
  return ctx;
};

export default useWorkspaceMembersTableContext;