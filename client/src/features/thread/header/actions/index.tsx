import { Dropdown, DropdownContent, DropdownTrigger } from 'src/components/Dropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/Tooltip';
import BookmarkButton from './BookmarkButton';
import DeleteButton from './DeleteButton';
import Icons from 'src/assets/Icons';
import { Button } from 'src/components/Button';

interface Props {
  threadId: string;
  currentIsBookmarked: boolean;
  agentName: string;
};

const Actions = ({ threadId, currentIsBookmarked, agentName }: Props) => {
  return (
    <div className='flex gap-1.5 justify-end items-start'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' style={{ width: '2rem', height: '2rem' }}>
            <Icons.Share />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom' sideOffset={4}>
          Share
        </TooltipContent>
      </Tooltip>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant='outline' size='icon' style={{ width: '2rem', height: '2rem' }}>
            <Icons.More />
          </Button>
        </DropdownTrigger>
        <DropdownContent align='end'>
          {!currentIsBookmarked && <BookmarkButton threadId={threadId} currentIsBookmarked={currentIsBookmarked} />}
          <DeleteButton threadId={threadId} agentName={agentName} />
        </DropdownContent>
      </Dropdown>
    </div>
  )
};

export default Actions;
