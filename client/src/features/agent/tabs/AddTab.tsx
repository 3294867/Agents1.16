import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import constants from 'src/constants';
import { Tab } from 'src/types';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  tabs: Tab[];
  currentThreadId: string;
  currentThreadPositionY: number;
}

const AddTab = ({ workspaceId, workspaceName, agentId, agentName, tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  const isAddTabDisabled = tabs.length > constants.tabMaxLength;

  const handleAddTab = async () => {
    const threadId = await postgresDB.addThread({ agentId });

    const updatedTabs: Tab[] = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: false }
      : t
    );
    const newTab: Tab = { id: threadId, workspaceId, agentId, name: null, isActive: true };
    updatedTabs.push(newTab);
    tabsStorage.save(workspaceName, agentName, updatedTabs);

    dispatchEvent.tabsUpdated(agentName);
    
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });
    
    navigate(`/${workspaceName}/${agentName}/${threadId}`);
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
};

export default AddTab;