import { memo } from 'react';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';

const BookmarkThreadButton = memo(() => {
  const { threadId, threadIsBookmarked } = hooks.features.useThreadContext();
  const handleClick = async () => {
    await postgresDB.updateThreadIsBookmarked({ threadId, isBookmarked: threadIsBookmarked });
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: threadIsBookmarked });
    dispatchEvent.threadIsBookmarkedUpdated({ threadId, isBookmarked: threadIsBookmarked });
  };
  
  return (
    <Button
      id={`bookmark_thread_button_${threadId}`}
      role='menuitem'
      variant='dropdown'
      onClick={handleClick}
      style={{ width: '100%' }}
      data-thread-id={threadId}
      data-is-bookmarked={threadIsBookmarked.toString()}
    >
      <Icons.BookmarkOutlined style={{ marginRight: '0.5rem' }}/>
      Bookmark
    </Button>
  );
});

export default BookmarkThreadButton;