import { Workspace } from 'src/types';

interface Props {
  workspaceName: string;
  workspaces: Workspace[];
}

const getWorkspaceId = ({ workspaceName, workspaces }: Props) => {
  const workspaceId = workspaces
    .filter(i => i.name === workspaceName)
    .map(i => i.id)[0];
  return workspaceId;
};

export default getWorkspaceId;