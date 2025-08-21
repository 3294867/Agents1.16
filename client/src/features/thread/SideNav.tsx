import { motion } from 'framer-motion';
import Button from 'src/components/button';
import constants from 'src/constants';
import hooks from 'src/hooks';
import { Query } from 'src/types';
import styles from './SideNav.module.css';

interface Props {
  threadBody: Query[];
  threadBodyLength: number;
}

const SideNavigation = ({ threadBody, threadBodyLength }: Props) => {
  const { isVisible, chatWidth } = hooks.features.useHandleSideNav({ threadBodyLength });

  const handleScrollToQuestion = (id: string) => {
    const question = document.getElementById(`question_${id}`);
    if (!question) return;

    const rect = question.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offsetPosition = rect.top + scrollTop - 56;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };
  
  return isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ transform: `translateX(calc(50% + ${chatWidth/2}px + ${constants.sideNavWidth}px + 32px))`, width: constants.sideNavWidth }}
      className={styles.sideNav}
    >
      {threadBody.map(i => (
        <Button
          variant='dropdown'
          size='sm'
          key={i.requestId}
          onClick={() => handleScrollToQuestion(i.requestId)}
        >
          <span className={styles.questionText}>
            {i.requestBody}
          </span>
        </Button>
      ))}
    </motion.div>
  );
};

export default SideNavigation;