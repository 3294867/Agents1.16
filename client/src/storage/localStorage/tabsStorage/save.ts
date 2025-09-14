import { Tab } from 'src/types';

interface Props {
  workspaceName:string;
  agentName: string;
  tabs: Tab[];
}

const save = ({ workspaceName, agentName, tabs }: Props): void => {
  try {
    localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(tabs));
  } catch (err) {
    console.error('Failed to save tabs: ', err);
  }
};

export default save;