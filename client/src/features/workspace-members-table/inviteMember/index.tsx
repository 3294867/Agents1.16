import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Popover from 'src/components/popover';
import Users from './Users';

interface Props {
  workspaceId: string;
}

const InviteMember = ({ workspaceId }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant='outline' size='sm' style={{ width: 'content-fit' }}>
          <Icons.Add style={{ marginLeft: '-0.5rem', marginRight: '0.5rem' }}/>
          Invite
        </Button>
      </Popover.Trigger>
      <Popover.Content align='end'>
        <Users workspaceId={workspaceId} />
      </Popover.Content>
    </Popover.Root>
  );
};
InviteMember.displayName = 'InviteMember';

export default InviteMember;
