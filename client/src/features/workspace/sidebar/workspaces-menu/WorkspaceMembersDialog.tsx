import hooks from 'src/hooks';
import workspaceMembersColumns from 'src/features/workspace-members-table/workspaceMembersColumns';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Error from 'src/components/error';
import Dialog from 'src/components/dialog';
import Heading from 'src/components/heading';
import WorkspaceMembersTable from 'src/features/workspace-members-table';
import { UserRole } from 'src/types';

interface Props {
  workspaceId: string;
  workspaceName: string;
  userRole: UserRole;
}

const WorkspaceMembersDialog = ({ workspaceId, workspaceName, userRole }: Props) => {
  const { members, isLoading, error } = hooks.features.useHandleWorkspaceMembersData({ workspaceId });

  if (isLoading) return <Loading />
  if (error || !members) return <Error error={ error ?? 'Something went wrong. Try again later.' }/>
  
  return userRole === 'admin' ? (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          role='menuitem'
          variant='dropdown'
          style={{ width: '100%' }}
        >
          <Icons.Users style={{ marginRight: '0.5rem' }}/>
          Members
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Heading variant='h4'>Members</Heading>
        <WorkspaceMembersTable
          columns={workspaceMembersColumns}
          data={members}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
        />
      </Dialog.Content>
    </Dialog.Root>
  ) : null;
};
WorkspaceMembersDialog.displayName = 'ManageMembersDialog';

export default WorkspaceMembersDialog;

const Loading = () => {
  return (
    <div>
      Loading
    </div>
  );
}