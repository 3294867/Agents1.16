import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { toast } from 'sonner';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';

interface Props {
  userId: string;
  threadId: string;
}

const ShareThreadButton = ({ userId, threadId }: Props) => {
  const [agentName, setAgentName] = useState<string | null>(null);
  const [sharedThreadId, setSharedThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);  

  const handleHover = async () => {
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
  
  const handleClick = () => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_CLIENT_URL}/${agentName}/${sharedThreadId}?share=true`);
    toast('Link has been copied to clipboard.');
  };

  return (
    <Button
      onMouseEnter={handleHover}
      onClick={handleClick}
      disabled={isLoading}
      variant='outline'
      size='icon'
      >
      {isLoading ? <Icons.Loader style={{ animation: 'spin 1s linear infinite' }} /> : <Icons.Share />}
    </Button>
  );
};

export default ShareThreadButton;