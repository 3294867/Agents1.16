import { motion } from 'framer-motion';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Heading from 'src/components/heading';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

interface NameProps {
  threadId: string;
  threadName: string | null;
  threadIsBookmarked: boolean;
}

const Name = ({ threadId, threadName, threadIsBookmarked }: NameProps) => {
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
      {threadIsBookmarked && <BookmarkButton threadId={threadId} isBookmarked={threadIsBookmarked} />}
    </motion.div>
  );
};

export default Name;

interface BookmarkButtonProps {
  threadId: string;
  isBookmarked: boolean;
}

const BookmarkButton = ({ threadId, isBookmarked }: BookmarkButtonProps) => {
  const handleClick = async () => {
    await postgresDB.updateThreadIsBookmarked({ threadId, isBookmarked });
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked });
    dispatchEvent.threadIsBookmarkedUpdated(threadId, isBookmarked);
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      {isBookmarked ? <Icons.BookmarkFilled /> : <Icons.BookmarkOutlined />}
    </Button>
  );
};