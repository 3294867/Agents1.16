import { memo } from 'react';
import { motion } from 'framer-motion';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Heading from 'src/components/heading';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import hooks from 'src/hooks';

const Name = memo(() => {
  const { threadName, threadIsBookmarked } = hooks.features.useThreadContext();
  if (!threadName) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}
    >
      <Heading variant='h3' style={{ width: '100%' }}>
        {threadName}
      </Heading>
      {threadIsBookmarked && <BookmarkButton />}
    </motion.div>
  );
});

export default Name;

const BookmarkButton = memo(() => {
  const { threadId, threadIsBookmarked } = hooks.features.useThreadContext();
  const handleClick = async () => {
    await postgresDB.updateThreadIsBookmarked({ threadId, isBookmarked: threadIsBookmarked });
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked: threadIsBookmarked });
    dispatchEvent.threadIsBookmarkedUpdated({ threadId, isBookmarked: threadIsBookmarked });
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      {threadIsBookmarked ? <Icons.BookmarkFilled /> : <Icons.BookmarkOutlined />}
    </Button>
  );
});