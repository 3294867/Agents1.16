import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
}

const load = ({ workspaceName, agentName }: Props): Tab[] | null => {
  try {
    const getSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
    if (getSavedTabs) return JSON.parse(getSavedTabs);
    return null;
  } catch (err) {
    console.error('Failed to load tabs (tabsStorage): ', err);
    return null;
  }
};

export default load;