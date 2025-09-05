import dispatchEvent from 'src/events/dispatchEvent';
import { Tab } from 'src/types';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  threadId: string;
  threadName: string | null;
}

const updateActive = ({ workspaceId, workspaceName, agentId, agentName, threadId, threadName }: Props): void => {
  try {
    const getSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
    if (getSavedTabs) {
      const remainingTabs = JSON.parse(getSavedTabs).filter((tab: Tab) => tab.id !== threadId);
      const updatedTab: Tab = { id: threadId, workspaceId, agentId, name: threadName, isActive: true };
      const updatedTabs = [...remainingTabs, updatedTab] as Tab[];

      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
      dispatchEvent.tabsUpdated({ agentName });
    }
  } catch (error) {
    console.error(`Failed to udpate tabs: `, error);
  }
};

export default updateActive;