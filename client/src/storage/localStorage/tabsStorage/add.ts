import dispatchEvent from 'src/events/dispatchEvent';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
  newTab: Tab;
}

const add = ({ workspaceName, agentName, newTab }: Props): void => {
  try {
    const loadSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
    if (!loadSavedTabs) {
      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify([newTab]));
    } else {
      const parsedSavedTabs = JSON.parse(loadSavedTabs);
      const updatedTabs = parsedSavedTabs.map((i: Tab) => i.agentId === newTab.agentId
        ? { ...i, isActive: false}
        : i
      )
      updatedTabs.push(newTab);
      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
    }
    dispatchEvent.tabsUpdated();
  } catch (err) {
    console.error(`Failed to add tab: `, err);
  }
};

export default add;