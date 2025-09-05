import dispatchEvent from 'src/events/dispatchEvent';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
  threadId: string;
}

const remove = ({ workspaceName, agentName, threadId}: Props): void => {
  try {
    const loadSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
    if (loadSavedTabs) {
      const threadIndex = JSON.parse(loadSavedTabs).findIndex((t: Tab) => t.id === threadId);

      const remainingTabs = JSON.parse(loadSavedTabs)
        .filter((t: Tab) => t.id !== threadId)
        .map((t: Tab, idx: number) =>
          idx === threadIndex - 1 ? { ...t, isActive: true } : t
        );

      const updatedTabs = [...remainingTabs] as Tab[];

      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
      dispatchEvent.tabsUpdated({ agentName });
    }
  } catch (error) {
    console.error(`Failed to udpate tabs: `, error);
  }
};

export default remove;