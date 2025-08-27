import BookmarkThreadButton from './BookmarkThreadButton';
import DeleteThreadDialog from './DeleteThreadDialog';
import Dropdown from 'src/components/dropdown';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import ShareThreadButton from './ShareThreadButton';

interface Props {
  userId: string;
  threadId: string;
  currentIsBookmarked: boolean;
  teamName: string;
  agentName: string;
}

const Actions = ({ userId, threadId, currentIsBookmarked, teamName, agentName }: Props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.375rem', justifyContent: 'end', alignItems: 'start'}}>
      <ShareThreadButton userId={userId} threadId={threadId} />
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.More />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content align='end' sideOffset={4}>
          {!currentIsBookmarked && <BookmarkThreadButton threadId={threadId} currentIsBookmarked={currentIsBookmarked} />}
          <DeleteThreadDialog threadId={threadId} teamName={teamName} agentName={agentName} />
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};

export default Actions;
