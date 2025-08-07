import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import Heading from 'src/components/Heading';
import { AgentTemplate } from 'src/types';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import styles from './AddAgentCard.module.css';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Dialog from 'src/components/Dialog';

const thumbnails = import.meta.glob('/src/assets/thumbnails/*.jpg', { eager: true, query: '?url', import: 'default' });

interface Props {
  userId: string;
  agentTemplate: AgentTemplate; 
}

const AgentCard = ({ userId, agentTemplate }: Props) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const agent= {
      id: uuidV4(),
      type: agentTemplate.type,
      model: agentTemplate.model,
      userId,
      name: agentTemplate.name,
      systemInstructions: agentTemplate.systemInstructions,
      stack: agentTemplate.stack,
      temperature: agentTemplate.temperature,
      webSearch: agentTemplate.webSearch,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const agentPostgres = await postgresDB.addAgent({ agent });
    await indexedDB.addAgent({ agent: agentPostgres });
    dispatchEvent.agentAdded(agentPostgres);
    navigate(`/${agent.name}`);
  };
  
  const imageSrc = thumbnails[`/src/assets/thumbnails/${agentTemplate.name}.jpg`] as string | undefined;

  return (
    <Dialog.CloseWindow>
      <div onClick={handleClick} className={styles.agentCard}>
        <img 
          src={imageSrc}
          alt={`${agentTemplate.name} agent`}
          className={styles.cardImage} 
          />
        <div className={styles.cardContent}>
          <Heading variant='h5' className={styles.cardTitle}>
            {capitalizeFirstLetter(agentTemplate.name)}
          </Heading>
        </div>
      </div>
    </Dialog.CloseWindow>
  )
};

export default AgentCard;