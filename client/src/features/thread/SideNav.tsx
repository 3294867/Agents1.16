import { motion } from 'framer-motion';
import constants from 'src/constants';
import hooks from 'src/hooks';
import { Query } from 'src/types';

interface Props {
  threadBody: Query[];
  threadBodyLength: number;
};

const SideNavigation = ({ threadBody, threadBodyLength }: Props) => {
  const { isVisible, chatWidth } = hooks.useHandleSideNav({ threadBodyLength });

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
      className='max-h-[192px] z-10 fixed top-20 flex flex-col p-2 gap-1 border border-border rounded-md bg-background overflow-y-auto scrollbar scrollbar-thumb-background-card-hover scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1'
    >
      {threadBody.map(i => (
        <button
          key={i.requestId}
          onClick={() => handleScrollToQuestion(i.requestId)}
          className='h-8 text-xs text-text-button font-semibold flex items-center justify-start py-2 pl-2 pr-3 rounded-md whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-background-card-hover'
        >
          <span className='max-w-[180px] truncate text-nowrap overflow-hidden'>
            {i.requestBody}
          </span>
        </button>
      ))}
    </motion.div>
  )
};

export default SideNavigation;