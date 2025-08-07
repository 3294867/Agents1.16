import Icons from 'src/assets/icons';
import Button from 'src/components/Button';
import Dialog from 'src/components/Dialog';
import Heading from 'src/components/Heading';
import hooks from 'src/hooks';
import AgentCard from './AddAgentCard';
import Error from 'src/components/Error';
import { Agent, AgentTemplate } from 'src/types';
import styles from './AddAgentDialog.module.css';

interface Props {
  userId: string;
  addedAgents: Agent[];
}

const AddAgentDialog = ({ userId, addedAgents }: Props) => {
  const agentTemplates = hooks.useGetAgentTemplates({ addedAgents });
  if (!agentTemplates) return <Error error='Failed to fetch agent templates' />

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant='outline' size='icon'>
          <Icons.Add />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <div className={styles.container}>
          <Heading variant='h4'>Add Agent</Heading>
          <div className={styles.agentsWrapper}>
            {agentTemplates.map((a: AgentTemplate) => (
              <AgentCard key={a.id} userId={userId} agentTemplate={a} />
            ))}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
};

export default AddAgentDialog;