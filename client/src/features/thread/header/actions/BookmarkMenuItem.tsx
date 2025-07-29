import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { DropdownMenuItem } from 'src/components/DropdownMenu';

interface Props {
  threadId: string;
  currentIsBookmarked: boolean;
};

const BookmarkMenuItem = ({ threadId, currentIsBookmarked }: Props) => {
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

export default BookmarkMenuItem;