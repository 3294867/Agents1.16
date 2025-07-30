import Title from './Title';
import Actions from './actions';

interface Props {
  threadId: string;
  threadTitle: string | null;
  isBookmarked: boolean;
  agentName: string;
}

const Header = ({ threadId, threadTitle, isBookmarked, agentName }: Props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'start', justifyContent: threadTitle === null ? 'end' : 'space-between' }}>
      <Title threadId={threadId} threadTitle={threadTitle} isBookmarked={isBookmarked} />
      <Actions threadId={threadId} currentIsBookmarked={isBookmarked} agentName={agentName} />
    </div>
  );
};

export default Header;