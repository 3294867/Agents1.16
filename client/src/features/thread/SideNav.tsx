import { memo } from 'react';
import { motion } from 'framer-motion';
import Button from 'src/components/button';
import constants from 'src/constants';
import hooks from 'src/hooks';
import styles from './SideNav.module.css';

const SideNav = memo(() => {
  const { threadBody } = hooks.features.useThreadContext();
  const { isVisible, chatWidth } = hooks.features.useHandleSideNav({ threadBodyLength: threadBody.length });

  const handleScrollToQuestion = ({ requestId }: { requestId: string }) => {
    const question = document.getElementById(`request_${requestId}`);
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
          onClick={() => handleScrollToQuestion({ requestId: i.requestId })}
        >
          <span className={styles.questionText}>
            {i.requestBody}
          </span>
        </Button>
      ))}
    </motion.div>
  );
});

export default SideNav;