import { cn } from 'src/utils/cn';
import Title from './Title';
import Actions from './actions';

interface Props {
  threadId: string;
  threadTitle: string | null;
  isBookmarked: boolean;
  agentName: string;
};

const Header = ({ threadId, threadTitle, isBookmarked, agentName }: Props) => {
  return (
    <div className={cn('flex items-start', threadTitle === null ? 'justify-end' : 'justify-between')}>
      <Title threadId={threadId} threadTitle={threadTitle} isBookmarked={isBookmarked} />
      <Actions threadId={threadId} currentIsBookmarked={isBookmarked} agentName={agentName} />
    </div>
  );
};

export default Header;