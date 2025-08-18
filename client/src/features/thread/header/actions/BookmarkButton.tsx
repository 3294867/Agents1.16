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
    await postgresDB.updatedThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: !currentIsBookmarked });
    dispatchEvent.threadIsBookmarkedUpdated(threadId, !currentIsBookmarked);
  };
  
  return (
    <Button
      id={`bookmark_thread_button_${threadId}`}
      role='menuitem'
      variant='dropdown'
      onClick={handleClick}
      style={{ width: '100%' }}
      data-thread-id={threadId}
      data-is-bookmarked={currentIsBookmarked.toString()}
    >
      <Icons.BookmarkOutlined style={{ marginRight: '0.5rem' }}/>
      Bookmark
    </Button>
  );
};

export default BookmarkButton;