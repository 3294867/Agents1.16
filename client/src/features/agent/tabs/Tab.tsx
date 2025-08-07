import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import { Agent as AgentType, Tab as TabType} from 'src/types';
import styles from './Tab.module.css';
import cn from 'src/utils/cn';

interface Props {
  agent: AgentType;
  tab: TabType;
  tabs: TabType[];
  currentThreadId: string;
  currentThreadPositionY: number;
}

const Tab = ({ agent, tab, tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  
  const handleSelectTab = async (threadId: string, agentId: string) => {
    /** Update tabs (localStorage) */
    const updatedTabs = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: t.id === threadId }
      : t
    );
    tabsStorage.save(agent.name, updatedTabs);

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated(agent.name);

    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });
    
    navigate(`/${agent.name}/${threadId}`);
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
    tabsStorage.save(agent.name, updatedTabs);

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated(agent.name);

    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });

    if (tabs.length > 1) {
      navigate(`/${agent.name}/${updatedTabs[updatedTabs.length - 1].id}`);
    } else {
      navigate(`/${agent.name}`);
    };
  };
  
  return (
    <a
      href={`/${agent.name}/${tab.id}`}
      className={cn(styles.tab, tab.isActive ? styles.active : styles.inactive)}
      onClick={() => handleSelectTab(tab.id, tab.agentId)}
    >
      <span className={styles.title}>
        {tab.title ?? 'New chat'}
      </span>
      {tabs.length > 1 && (
        <button
          className={styles.closeBtn}
          onClick={(e) => handleRemoveTab(e, tab.id)}
        >
          <Icons.Close className={cn(styles.icon, tab.isActive ? styles.iconActive : styles.iconInactive)} />
        </button>
      )}
    </a>
  );
};

export default Tab;