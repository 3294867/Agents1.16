import { memo } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Dialog from 'src/components/dialog';
import Heading from 'src/components/heading';
import AgentThumbnails from './AgentThumbnails';

const AddAgentDialog = memo(() => {
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
        <AgentThumbnails />
      </Dialog.Content>
    </Dialog.Root>
  )
});

export default AddAgentDialog;
