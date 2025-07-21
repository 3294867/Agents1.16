import { motion } from 'framer-motion';
import { Button } from 'src/components/Button';
import hooks from 'src/hooks';
import { Query } from 'src/types';

interface SideNavigationProps {
  threadBody: Query[];
  threadBodyLength: number;
};

const SideNavigation = (props: SideNavigationProps) => {
  const { isVisible, chatWidth } = hooks.useHandleSideNav(props.threadBodyLength);

  const sideNavWidth = 200;

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
      style={{ transform: `translateX(calc(50% + ${chatWidth/2}px + ${sideNavWidth}px + 32px))`, width: sideNavWidth }}
      className='z-10 fixed top-20 flex flex-col p-2 border border-border rounded-md bg-background'
    >
      {props.threadBody.map(i => (
        <Button
          key={i.requestId}
          onClick={() => handleScrollToQuestion(i.requestId)}
          variant='ghost'
          size='sm'
          className='w-full justify-start pl-2 text-xs font-semibold hover:text-text-primary hover:bg-white/15 transition-colors duration-150'
        >
          <span className='max-w-[180px] truncate text-nowrap overflow-hidden'>
            {i.requestBody}
          </span>
        </Button>
      ))}
    </motion.div>
  )
};

export default SideNavigation;