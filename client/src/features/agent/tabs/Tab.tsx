import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import utils from 'src/utils';
import Icons from 'src/assets/icons';
import { Tab as TabType} from 'src/types';
import styles from './Tab.module.css';

interface Props {
  tab: TabType;
  tabs: TabType[];
  currentThreadId: string;
  currentThreadPositionY: number;
}

const Tab = memo(({ tab, tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  const { workspaceName, agentName } = hooks.features.useAgentContext();
  
  const handleSelectTab = async (threadId: string, agentId: string) => {
    /** Update tabs (localStorage) */
    const updatedTabs = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: t.id === threadId }
      : t
    );
    tabsStorage.save({ workspaceName, agentName, tabs: updatedTabs });

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated({ agentName });

    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });
    
    navigate(`/${workspaceName}/${agentName}/${threadId}`);
  };

  const handleRemoveTab = async (e: React.MouseEvent<HTMLButtonElement>, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    /** Update tabs (localStorage) */
    const removedTab = tabs.find(t => t.id === threadId);
    if (!removedTab) return;
    const updatedTabs = tabs.filter(t => t.id !== threadId);
    if (updatedTabs.length > 0 && removedTab.isActive) {
      updatedTabs[updatedTabs.length - 1].isActive = true;
    }
    tabsStorage.save({ workspaceName, agentName, tabs: updatedTabs });

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated({ agentName });

    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });

    if (tabs.length > 1) {
      navigate(`/${workspaceName}/${agentName}/${updatedTabs[updatedTabs.length - 1].id}`);
    } else {
      navigate(`/${workspaceName}/${agentName}`);
    };
  };
  
  return (
    <a
      href={`/${workspaceName}/${agentName}/${tab.id}`}
      className={utils.cn(styles.tab, tab.isActive ? styles.active : styles.inactive)}
      onClick={() => handleSelectTab(tab.id, tab.agentId)}
    >
      <span className={styles.title}>
        {tab.name ?? 'New chat'}
      </span>
      {tabs.length > 1 && (
        <button
          className={styles.closeBtn}
          onClick={(e) => handleRemoveTab(e, tab.id)}
        >
          <Icons.Close className={utils.cn(styles.icon, tab.isActive ? styles.iconActive : styles.iconInactive)} />
        </button>
      )}
    </a>
  );
});

export default Tab;