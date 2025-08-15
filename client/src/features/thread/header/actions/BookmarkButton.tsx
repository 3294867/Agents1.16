import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';

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
    <Button
      variant='dropdown'
      onClick={handleClick}
      style={{ width: '100%' }}
    >
      <Icons.BookmarkOutlined style={{ marginRight: '0.5rem' }}/>
      Bookmark
    </Button>
  );
};

export default BookmarkButton;