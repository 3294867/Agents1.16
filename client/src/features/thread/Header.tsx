import { motion } from 'framer-motion';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { Heading } from 'src/components/Heading';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/components/DropdownMenu';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/Tooltip';
import { cn } from 'src/utils/cn';

interface HeaderProps {
  threadId: string;
  threadTitle: string | null;
  isBookmarked: boolean;
};

const Header = ({ threadId, threadTitle, isBookmarked }: HeaderProps) => {
  return (
    <div className={cn('flex items-start', threadTitle === null ? 'justify-end' : 'justify-between')}>
      <Title threadId={threadId} threadTitle={threadTitle} isBookmarked={isBookmarked} />
      <Actions threadId={threadId} currentIsBookmarked={isBookmarked} />
    </div>
  );
};

export default Header;

interface TitleProps {
  threadId: string;
  threadTitle: string | null;
  isBookmarked: boolean;
};

const Title = ({ threadId, threadTitle, isBookmarked }: TitleProps) => {
  if (!threadTitle) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className='flex items-start gap-2'
    >
      <Heading variant='h3' className='w-full'>
        {threadTitle}
      </Heading>
      {isBookmarked && <BookmarkButton threadId={threadId} currentIsBookmarked={isBookmarked} />}
    </motion.div>
  )
};

interface BookmarkButtonProps {
  threadId: string;
  currentIsBookmarked: boolean;
};

const BookmarkButton = ({ threadId, currentIsBookmarked }: BookmarkButtonProps) => {
  const handleClick = async () => {
    /** Update 'isBookmarked' property (PostgresDB) */
    await postgresDB.updatedThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });
    
    /** Update 'isBookmarked' property (IndexedDB) */
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });

    /** Dispatch isBookmarkedUpdated event (Events) */
    dispatchEvent.threadIsBookmarkedUpdated(threadId, !currentIsBookmarked);
  };
  
  return (
    <button onClick={handleClick} className='h-5 w-5 text-text-button cursor-pointer'>
      {currentIsBookmarked
        ? <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z' fill='currentColor' fillRule='evenodd' clipRule='evenodd'></path></svg>
        : <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 2.5C3 2.22386 3.22386 2 3.5 2H11.5C11.7761 2 12 2.22386 12 2.5V13.5C12 13.6818 11.9014 13.8492 11.7424 13.9373C11.5834 14.0254 11.3891 14.0203 11.235 13.924L7.5 11.5896L3.765 13.924C3.61087 14.0203 3.41659 14.0254 3.25762 13.9373C3.09864 13.8492 3 13.6818 3 13.5V2.5ZM4 3V12.5979L6.97 10.7416C7.29427 10.539 7.70573 10.539 8.03 10.7416L11 12.5979V3H4Z' fill='currentColor' fillRule='evenodd' clipRule='evenodd'></path></svg>
      }
    </button>
  )
};

interface ActionsProps {
  threadId: string;
  currentIsBookmarked: boolean;
};

const Actions = ({ threadId, currentIsBookmarked }: ActionsProps) => {
  console.log('currentIsBookmarked', currentIsBookmarked);
  
  const handleIsBookmarked = async () => {
    /** Update 'isBookmarked' property (PostgresDB) */
    await postgresDB.updatedThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });
    
    /** Update 'isBookmarked' property (IndexedDB) */
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });

    /** Dispatch isBookmarkedUpdated event (Events) */
    dispatchEvent.threadIsBookmarkedUpdated(threadId, !currentIsBookmarked);
  };
  
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
          {!currentIsBookmarked && (
            <DropdownMenuItem onClick={handleIsBookmarked} className='text-text-primary cursor-pointer'>
              <svg className='w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>
              <p className='font-medium text-xs leading-snug'>
                Bookmark
              </p>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className='text-text-primary cursor-pointer'>
            <svg className='w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg>
            <p className='font-medium text-xs leading-snug'>
              Delete
            </p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};