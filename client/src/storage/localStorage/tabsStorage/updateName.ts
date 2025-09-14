import dispatchEvent from 'src/events/dispatchEvent';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
  tabId: string;
  tabName: string | null;
}

const updateName = ({ workspaceName, agentName, tabId, tabName }: Props) => {
  try {
    const loadSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
    if (loadSavedTabs) {
      const parsedSavedTabs = JSON.parse(loadSavedTabs);
      const updatedTabs = parsedSavedTabs.map((i: Tab) => i.id === tabId
        ? { ...i, name: tabName }
        : { ...i }
      );
      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
      dispatchEvent.tabsUpdated();
    }
  } catch (err) {
    console.error('Failed to update tabName (tabsStorage): ', err)
  }
};

export default updateName;