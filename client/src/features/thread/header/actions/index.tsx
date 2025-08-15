import BookmarkButton from './BookmarkButton';
import Dropdown from 'src/components/dropdown';
import Tooltip from 'src/components/tooltip';
import DeleteDialog from './DeleteDialog';
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
        <Tooltip.Content side='bottom' sideOffset={4}>
          Share
        </Tooltip.Content>
      </Tooltip.Root>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.More />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content align='end'>
          {!currentIsBookmarked && <BookmarkButton threadId={threadId} currentIsBookmarked={currentIsBookmarked} />}
          <DeleteDialog threadId={threadId} agentName={agentName} />
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};

export default Actions;
