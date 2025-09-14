import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import utils from 'src/utils';
import Icons from 'src/assets/icons';
import { Tab as TabType} from 'src/types';
import styles from './Tab.module.css';

interface Props {
  tab: TabType;
  tabs: TabType[];
  currentThreadId: string;
}

const Tab = memo(({ tab, tabs, currentThreadId }: Props) => {
  const navigate = useNavigate();
  const { workspaceName, agentName } = hooks.features.useAgentContext();
  
  const handleSelectTab = async ({ tabId }: { tabId: string}) => {
    tabsStorage.updateActive({ workspaceName, agentName, tabId });
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: window.scrollY
    });
  };

  const handleRemoveTab = async ({ e, tabId }: {e: React.MouseEvent<HTMLButtonElement>, tabId: string }) => {
    e.preventDefault();
    e.stopPropagation();
    tabsStorage.remove({ workspaceName, agentName, tabId });
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: window.scrollY
    });

    setTimeout(() => {
      if (tabs.length > 1) {
        navigate(`/${workspaceName}/${agentName}/${tabs[tabs.length - 2].id}`);
      } else {
        navigate(`/${workspaceName}/${agentName}`);
      };
    },100);
  };
  
  return (
    <Link to={`/${workspaceName}/${agentName}/${tab.id}`}
      onClick={() => handleSelectTab({ tabId: tab.id })}
      className={utils.cn(styles.tab, tab.isActive ? styles.active : styles.inactive)}
    >
      <span className={styles.title}>
        {tab.name ?? 'New chat'}
      </span>
      {tabs.length > 1 && (
        <button
          className={styles.closeBtn}
          onClick={(e) => handleRemoveTab({ e, tabId: tab.id })}
        >
          <Icons.Close className={utils.cn(styles.icon, tab.isActive ? styles.iconActive : styles.iconInactive)} />
        </button>
      )}
    </Link>
  );
});

export default Tab;