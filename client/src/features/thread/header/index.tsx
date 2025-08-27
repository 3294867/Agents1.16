import Title from './Title';
import Actions from './actions';

interface Props {
  userId: string;
  threadId: string;
  threadTitle: string | null;
  isBookmarked: boolean;
  teamName: string;
  agentName: string;
}

const Header = ({ userId, threadId, threadTitle, isBookmarked, teamName, agentName }: Props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'start', justifyContent: threadTitle === null ? 'end' : 'space-between' }}>
      <Title threadId={threadId} threadTitle={threadTitle} isBookmarked={isBookmarked} />
      <Actions userId={userId} threadId={threadId} currentIsBookmarked={isBookmarked} teamName={teamName} agentName={agentName} />
    </div>
  );
};

export default Header;