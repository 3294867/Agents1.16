import { memo, useState } from 'react';
import { toast } from 'sonner';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Tooltip from 'src/components/tooltip';

const ShareThreadButton = memo(() => {
  const { workspaceId, threadId } = hooks.features.useThreadContext();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [sharedThreadId, setSharedThreadId] = useState<string | null>(null);
  const [isLinkCreated, setIsLinkCreated] = useState(false);

  const handleMouseEnter = async () => {
    if (isLinkCreated) return;
    try {
      const { agentType: publicThreadAgentType, threadId: publicThreadId } = await postgresDB.addPublicThread({ threadId });
      setSharedThreadId(publicThreadId);
      const agentIDB = await indexedDB.getAgentByType({ agentType: publicThreadAgentType });
      if (!agentIDB) {
        const agentPostgres = await postgresDB.getAgentByType({ agentType: publicThreadAgentType});
        if (!agentPostgres) {
          const getAvailableAgentByType = await postgresDB.getAvailableAgentByType({ agentType: publicThreadAgentType });
          const addAgent = await postgresDB.addAgent({ workspaceId, agentData: getAvailableAgentByType });
          setAgentName(addAgent.name);
          return;
        }
        setAgentName(agentPostgres.name);
        return;
      }
      setAgentName(agentIDB.name);
      setIsLinkCreated(true);
    } catch (err) {
      console.error(`Failed to create public thread: ${err}`);
    }
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
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          variant='outline'
          size='icon'
          style={{ cursor: 'pointer' }}
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