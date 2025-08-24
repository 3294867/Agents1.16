import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Popover from 'src/components/popover';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Heading from 'src/components/heading';
import Paragraph from 'src/components/paragraph';
import styles from './ShareThreadButton.module.css';

interface Props {
  userId: string;
  threadId: string;
}

const ShareThreadButton = ({ userId, threadId }: Props) => {
  const [agentName, setAgentName] = useState<string | null>(null);
  const [sharedThreadId, setSharedThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createPublicLink = async () => {
    setIsLoading(true);
    const { agentType: publicThreadAgentType, threadId: publicThreadId } = await postgresDB.addPublicThread({ threadId });
    setSharedThreadId(publicThreadId);
    
    const agentIDB = await indexedDB.getAgentByType({ userId, agentType: publicThreadAgentType});
    
    if (!agentIDB) {
      const agentPostgres = await postgresDB.getAgentByType({ userId, agentType: publicThreadAgentType});
      if (!agentPostgres) {
        const getAvailableAgentByType = await postgresDB.getAvailableAgentByType({ agentType: publicThreadAgentType });
        
        const addAgent = await postgresDB.addAgent({ agent: {
          id: uuidV4(),
          type: getAvailableAgentByType.type,
          model: getAvailableAgentByType.model,
          userId,
          name: getAvailableAgentByType.name,
          systemInstructions: getAvailableAgentByType.systemInstructions,
          stack: getAvailableAgentByType.stack,
          temperature: getAvailableAgentByType.temperature,
          webSearch: getAvailableAgentByType.webSearch,
          createdAt: new Date(),
          updatedAt: new Date()
        }});

        await indexedDB.addAgent({ agent: addAgent });
        dispatchEvent.agentAdded(addAgent);
        setAgentName(addAgent.name);
        return;
      }
      await indexedDB.addAgent({ agent: agentPostgres });
      dispatchEvent.agentAdded(agentPostgres);
      setAgentName(agentPostgres.name);
      return;
    }
    
    setAgentName(agentIDB.name);
    setIsLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_CLIENT_URL}/${agentName}/${sharedThreadId}?share=true`);
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          onClick={createPublicLink}
          variant='outline'
          size='icon'
        >
          <Icons.Share />
        </Button>
      </Popover.Trigger>
      <Popover.Content align='end'>
        <Heading variant='h6'>
          Share conversation
        </Heading>
        <div className={styles.container}>
          <Paragraph isMuted={true} >{isLoading ? 'Creating a public conversation...' : 'Public conversation created'}</Paragraph>
          <Button
            className={styles.button}
            data-prevent-popover-close
            disabled={isLoading}
            onClick={copyLink}
          >
            <Icons.Copy className={styles.icon} />
            Copy link
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ShareThreadButton;