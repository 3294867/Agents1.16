import { memo } from 'react';
import Actions from './actions';
import Name from './Name';

interface Props {
  userId: string;
  workspaceName: string;
  agentName: string;
  threadId: string;
  threadName: string | null;
  threadIsBookmarked: boolean;
}

const Header = memo(({ userId, workspaceName, agentName, threadId, threadName, threadIsBookmarked }: Props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'start', justifyContent: threadName === null ? 'end' : 'space-between' }}>
      <Name
        threadId={threadId}
        threadName={threadName}
        threadIsBookmarked={threadIsBookmarked}
      />
      <Actions
        userId={userId}
        workspaceName={workspaceName}
        agentName={agentName}
        threadId={threadId}
        isBookmarked={threadIsBookmarked}
      />
    </div>
  );
});

export default Header;