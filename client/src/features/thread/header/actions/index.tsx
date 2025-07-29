import { Dropdown, DropdownContent, DropdownTrigger } from 'src/components/Dropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/Tooltip';
import BookmarkButton from './BookmarkButton';
import DeleteButton from './DeleteButton';

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
          <button className='h-8 w-8 text-text-button flex items-center justify-center rounded-full border border-border hover:border-white/20 focus-visible:outline-none cursor-pointer bg-background hover:bg-background-hover shadow-sm'>
            <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M12 2v13'/><path d='m16 6-4-4-4 4'/><path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/></svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side='bottom' sideOffset={4}>
          Share
        </TooltipContent>
      </Tooltip>
      <Dropdown>
        <DropdownTrigger asChild>
          <button className='h-8 w-8 text-text-button flex items-center justify-center rounded-full border border-border hover:border-white/20 focus-visible:outline-none cursor-pointer bg-background hover:bg-background-hover shadow-sm'>
            <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><circle cx='12' cy='12' r='1'/><circle cx='12' cy='5' r='1'/><circle cx='12' cy='19' r='1'/></svg>
          </button>
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
