import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import constants from 'src/constants';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import { Tab } from 'src/types';

interface Props {
  tabs: Tab[];
  currentThreadId: string;
  currentThreadPositionY: number;
}

const AddTab = memo(({ tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  const { workspaceId, workspaceName, agentId, agentName } = hooks.features.useAgentContext();
  const isAddTabDisabled = tabs.length > constants.tabMaxLength;

  const handleAddTab = async () => {
    const threadData = await postgresDB.addThread({ agentId });

    const updatedTabs: Tab[] = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: false }
      : t
    );
    const newTab: Tab = { id: threadData.id, workspaceId, agentId, name: null, isActive: true };
    updatedTabs.push(newTab);
    tabsStorage.save({ workspaceName, agentName, tabs: updatedTabs });

    dispatchEvent.tabsUpdated({ agentName });
    
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });
    
    navigate(`/${workspaceName}/${agentName}/${threadData.id}`);
  };
  
  return (
    <Button
      disabled={isAddTabDisabled}
      variant='outline'
      size='icon'
      style={{ height: '2.25rem', width: '2.25rem' }}
      onClick={handleAddTab}
    >
      <Icons.Add />
    </Button>
  );
});

export default AddTab;