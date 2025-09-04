import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';

interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const BookmarkThreadButton = ({ threadId, isBookmarked }: Props) => {
  const handleClick = async () => {
    await postgresDB.updateThreadIsBookmarked({ threadId, isBookmarked });
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked });
    dispatchEvent.threadIsBookmarkedUpdated(threadId, isBookmarked);
  };
  
  return (
    <Button
      id={`bookmark_thread_button_${threadId}`}
      role='menuitem'
      variant='dropdown'
      onClick={handleClick}
      style={{ width: '100%' }}
      data-thread-id={threadId}
      data-is-bookmarked={isBookmarked.toString()}
    >
      <Icons.BookmarkOutlined style={{ marginRight: '0.5rem' }}/>
      Bookmark
    </Button>
  );
};

export default BookmarkThreadButton;