import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/components/DropdownMenu';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/Tooltip';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from 'src/components/Dialog';
import { Button } from 'src/components/Button';
import { Paragraph } from 'src/components/Paragraph';

interface ActionsProps {
  threadId: string;
  currentIsBookmarked: boolean;
  agentName: string;
};

const Actions = ({ threadId, currentIsBookmarked, agentName }: ActionsProps) => {
  return (
    <div className='flex gap-1.5 justify-end items-center'>
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='h-8 w-8 text-text-button flex items-center justify-center rounded-full border border-border hover:border-white/20 focus-visible:outline-none cursor-pointer bg-background hover:bg-background-hover shadow-sm'>
            <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><circle cx='12' cy='12' r='1'/><circle cx='12' cy='5' r='1'/><circle cx='12' cy='19' r='1'/></svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <BookmarkMenuItem threadId={threadId} currentIsBookmarked={currentIsBookmarked} />
          <DeleteMenuItem threadId={threadId} agentName={agentName} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};

export default Actions;

interface BookmarkMenuItemProps {
  threadId: string;
  currentIsBookmarked: boolean;
};

const BookmarkMenuItem = ({ threadId, currentIsBookmarked }: BookmarkMenuItemProps) => {
  const handleIsBookmarked = async () => {
    /** Update 'isBookmarked' property (PostgresDB) */
    await postgresDB.updatedThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });
    
    /** Update 'isBookmarked' property (IndexedDB) */
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });

    /** Dispatch isBookmarkedUpdated event (Events) */
    dispatchEvent.threadIsBookmarkedUpdated(threadId, !currentIsBookmarked);
  };
  
  return (
    <>
      {!currentIsBookmarked && (
        <DropdownMenuItem onClick={handleIsBookmarked} className='text-text-primary cursor-pointer'>
          <svg className='w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>
          <p className='font-medium text-xs leading-snug'>
            Bookmark
          </p>
        </DropdownMenuItem>
      )}
    </>
  )
};

interface DeleteMenuItemProps {
  threadId: string;
  agentName: string;
};

const DeleteMenuItem = ({ threadId, agentName }: DeleteMenuItemProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  
  const handleDeleteThread = async () => {
    /** Delete thread (PostgresDB) */
    await postgresDB.deleteThread({ threadId });
    
    /** Delete thread (IndexedDB) */
    await indexedDB.deleteThread({ threadId });

    /** Delete tab (localStorage) */
    tabsStorage.deleteTab(agentName, threadId)
    
    /** Navigate to the next tab */
    navigate(`/${agentName}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className='text-text-primary cursor-pointer'>
          <svg className='w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg>
          <p className='font-medium text-xs leading-snug'>
            Delete
          </p>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent aria-describedby='' className='focus-visible:outline-none'>
        <DialogTitle>
          Delete conversation
        </DialogTitle>
        <Paragraph variant='thin' isMuted={true}>
          Are you sure you want to delete this conversation? This action cannot be undone.
        </Paragraph>
        <div className='w-full flex justify-end '>
          <Button onClick={() => setIsOpen(false)} variant='ghost'>
            Cancel
          </Button>
          <Button onClick={handleDeleteThread}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}