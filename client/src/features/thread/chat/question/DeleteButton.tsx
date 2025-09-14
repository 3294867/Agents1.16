import { memo } from 'react';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

interface Props {
  requestId: string;
  responseId: string;
}

const DeleteButton = memo(({ requestId, responseId }: Props) => {
  const {
    workspaceName,
    agentName,
    threadId,
    threadBodyLength
  } = hooks.features.useThreadContext();
  
  const handleClick = async () => {
    await postgresDB.deleteReqRes({ threadId, requestId, responseId });
    await indexedDB.deleteReqRes({ threadId, requestId });

    if (threadBodyLength == 1) {
      await postgresDB.removeThreadName({ threadId });
      await indexedDB.removeThreadName({ threadId });
      tabsStorage.updateName({ workspaceName, agentName, tabId: threadId, tabName: null});
      dispatchEvent.threadNameUpdated({ threadName: null });
    }
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      <Icons.Delete />
    </Button>
  );
});

export default DeleteButton;