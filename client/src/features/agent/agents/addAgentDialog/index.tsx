import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Dialog from 'src/components/dialog';
import Heading from 'src/components/heading';
import Error from 'src/components/error';
import hooks from 'src/hooks';
import AgentCard from './AddAgentCard';
import { Team, Agent } from 'src/types';
import styles from './AddAgentDialog.module.css';

interface Props {
  userId: string;
  team: Team;
  addedAgents: Agent[];
}

const AddAgentDialog = ({ userId, team, addedAgents }: Props) => {
  const availableAgents = hooks.features.useHandleAvailableAgents({ addedAgents });
  if (!availableAgents) return <Error error='Failed to fetch available agents' />

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant='dropdown'>
          <Icons.Add style={{ marginRight: '0.5rem' }}/>
          Add Agent
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Heading variant='h4'>Add Agent</Heading>
        <div className={styles.agentsWrapper}>
          {availableAgents.map((a: Agent) => (
            <AgentCard key={a.id} userId={userId} team={team} availableAgent={a} />
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
};

export default AddAgentDialog;