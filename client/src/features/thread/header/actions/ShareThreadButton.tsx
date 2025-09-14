import { memo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { toast } from 'sonner';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Tooltip from 'src/components/tooltip';

const ShareThreadButton = memo(() => {
  const { userId, threadId } = hooks.features.useThreadContext();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [sharedThreadId, setSharedThreadId] = useState<string | null>(null);
  const [isLinkCreated, setIsLinkCreated] = useState(false);

  const handleMouseEnter = async () => {
    if (isLinkCreated) return;
    const { agentType: publicThreadAgentType, threadId: publicThreadId } = await postgresDB.addPublicThread({ threadId });
    setSharedThreadId(publicThreadId);
    
    const agentIDB = await indexedDB.getAgentByType({ agentType: publicThreadAgentType });
    
    if (!agentIDB) {
      const agentPostgres = await postgresDB.getAgentByType({ agentType: publicThreadAgentType});
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
        dispatchEvent.agentAdded({ agent: addAgent });
        setAgentName(addAgent.name);
        return;
      }
      await indexedDB.addAgent({ agent: agentPostgres });
      dispatchEvent.agentAdded(agentPostgres);
      setAgentName(agentPostgres.name);
      return;
    }
    
    setAgentName(agentIDB.name);
    setIsLinkCreated(true);
  };
  
  const handleClick = () => {
    setTimeout(() => {
      navigator.clipboard.writeText(`${import.meta.env.VITE_CLIENT_URL}/${agentName}/${sharedThreadId}?share=true`);
      toast('Link has been copied to clipboard.');
    },100);
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button
          // onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          variant='outline'
          size='icon'
          >
          <Icons.Share />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        Share chat
      </Tooltip.Content>
    </Tooltip.Root>
  );
});

export default ShareThreadButton;