import BookmarkThreadButton from './BookmarkButton';
import DeleteThreadDialog from './DeleteThreadDialog';
import Dropdown from 'src/components/dropdown';
import Tooltip from 'src/components/tooltip';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  threadId: string;
  currentIsBookmarked: boolean;
  agentName: string;
}

const Actions = ({ threadId, currentIsBookmarked, agentName }: Props) => {
  const savedTabs = tabsStorage.load(agentName);
  if (!savedTabs) return;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.375rem', justifyContent: 'end', alignItems: 'start'}}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.Share />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Share
        </Tooltip.Content>
      </Tooltip.Root>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.More />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content align='end' sideOffset={4}>
          {!currentIsBookmarked && <BookmarkThreadButton threadId={threadId} currentIsBookmarked={currentIsBookmarked} />}
          <DeleteThreadDialog threadId={threadId} agentName={agentName} />
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};

export default Actions;
