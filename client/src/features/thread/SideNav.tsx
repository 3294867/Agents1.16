import { Button } from 'src/components/Button';
import { Query } from 'src/types';

interface SideNavigationProps {
  threadBody: Query[];
};

const SideNavigation = (props: SideNavigationProps) => {
  const handleScrollToQuestion = (id: string) => {
    const question = document.getElementById(id);
    question?.scrollIntoView({
      behavior: 'smooth'
    })
  };
  
  return (
    <div className='z-10 fixed top-20 left-0 right-0 w-[1124px] mx-auto flex justify-end'>
      <div className='w-[200px] flex flex-col p-2 border border-border rounded-md bg-background'>
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
      </div>
    </div>
  )
};

export default SideNavigation;