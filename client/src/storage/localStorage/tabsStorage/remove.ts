import dispatchEvent from 'src/events/dispatchEvent';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
  tabId: string;
}

const remove = ({ workspaceName, agentName, tabId }: Props) => {
  try {
    const loadSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
    if (loadSavedTabs) {
      const parsedSavedTabs = JSON.parse(loadSavedTabs);
      let updatedTabs: Tab[] = [];
      
      const activeTabId = parsedSavedTabs
        .filter((i: Tab) => i.isActive === true)
        .map((i: Tab) => i.id)[0];

      if (tabId === activeTabId) {
        updatedTabs = parsedSavedTabs
          .filter((i: Tab) => i.id !== tabId)
          .map((i: Tab, idx: number) => idx === parsedSavedTabs.length - 2
            ? { ...i, isActive: true }
            : { ...i, isActive: false }
          )
      } else {
        updatedTabs = parsedSavedTabs
          .filter((i: Tab) => i.id !== tabId)
      }
      
      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
      dispatchEvent.tabsUpdated();
    }
  } catch (err) {
    console.error(`Failed to remove tab (tabsStorage): `, err);
  }
};

export default remove;