import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
  currentIsBookmarked: boolean;
}

const BookmarkButton = ({ threadId, currentIsBookmarked }: Props) => {
  const handleClick = async () => {
    /** Update 'isBookmarked' property (PostgresDB) */
    await postgresDB.updatedThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });
    
    /** Update 'isBookmarked' property (IndexedDB) */
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });

    /** Dispatch isBookmarkedUpdated event (Events) */
    dispatchEvent.threadIsBookmarkedUpdated(threadId, !currentIsBookmarked);
  };
  
  return (
    <button
      onClick={handleClick}
      className='h-8 text-text-button gap-2 flex items-center justify-start px-2 rounded-md focus-visible:outline-none cursor-pointer shadow-sm hover:bg-gray-100/10'
    >
      <svg className='w-4 h-4 mr-1' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' ><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>
      Bookmark
    </button>
  );
};

export default BookmarkButton;