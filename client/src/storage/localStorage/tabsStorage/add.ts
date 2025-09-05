import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from '.';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
  tab: Tab;
}

const add = ({ workspaceName, agentName, tab }: Props): void => {
  try {
    const loadSavedTabs = tabsStorage.load({ workspaceName, agentName });
    const newTab = {
      id: tab.id,
      workspaceId: tab.workspaceId,
      agentId: tab.agentId,
      name: tab.name,
      isActive: true,
    }

    if (loadSavedTabs === null) {
      tabsStorage.save({ workspaceName, agentName, tabs: [newTab] });
    } else {
      const updatedTabs: Tab[] = [];
      for (const t of loadSavedTabs) {
        if (t.agentId === tab.agentId) {
          t.isActive = false;
        };
        updatedTabs.push(t);
      }
      tabsStorage.save({ workspaceName, agentName, tabs: [...updatedTabs, newTab] });
    }
    dispatchEvent.tabsUpdated({ agentName });

  } catch (error) {
    console.error(`Failed to add tab: `, error);
  }
};

export default add;