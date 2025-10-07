import hooks from 'src/hooks';
import workspaceMembersColumns from 'src/features/data-table/workspaceMembersColumns';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Error from 'src/components/error';
import Dialog from 'src/components/dialog';
import Heading from 'src/components/heading';
import DataTable from 'src/features/data-table';
import { UserRole } from 'src/types';

interface Props {
  workspaceId: string;
  userRole: UserRole;
}

const ManageMembersDialog = ({ workspaceId, userRole }: Props) => {
  const { members, isLoading, error } = hooks.features.useHandleMembersTable({ workspaceId });

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
        <DataTable
          workspaceId={workspaceId}
          columns={workspaceMembersColumns}
          data={members}
        />
      </Dialog.Content>
    </Dialog.Root>
  ) : null;
};
ManageMembersDialog.displayName = 'ManageMembersDialog';

export default ManageMembersDialog;

const Loading = () => {
  return (
    <div>
      Loading
    </div>
  );
}