import { motion } from 'framer-motion';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Heading from 'src/components/heading';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

interface TitleProps {
  threadId: string;
  threadTitle: string | null;
  isBookmarked: boolean;
}

const Title = ({ threadId, threadTitle, isBookmarked }: TitleProps) => {
  if (!threadTitle) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}
    >
      <Heading variant='h3' style={{ width: '100%' }}>
        {threadTitle}
      </Heading>
      {isBookmarked && <BookmarkButton threadId={threadId} currentIsBookmarked={isBookmarked} />}
    </motion.div>
  );
};

export default Title;

interface BookmarkButtonProps {
  threadId: string;
  currentIsBookmarked: boolean;
}

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
    <Button onClick={handleClick} variant='ghost' size='icon'>
      {currentIsBookmarked ? <Icons.BookmarkFilled /> : <Icons.BookmarkOutlined />}
    </Button>
  );
};