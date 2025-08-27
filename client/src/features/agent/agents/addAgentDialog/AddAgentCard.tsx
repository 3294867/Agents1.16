import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import utils from 'src/utils';
import Heading from 'src/components/heading';
import Dialog from 'src/components/dialog';
import { Team, Agent } from 'src/types';
import styles from './AddAgentCard.module.css';

interface Props {
  userId: string;
  team: Team;
  availableAgent: Agent;
}

const AgentCard = ({ userId, team, availableAgent }: Props) => {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    const agent= {
      id: uuidV4(),
      type: availableAgent.type,
      model: availableAgent.model,
      userId,
      teamId: team.id,
      teamName: team.name,
      name: availableAgent.name,
      systemInstructions: availableAgent.systemInstructions,
      stack: availableAgent.stack,
      temperature: availableAgent.temperature,
      webSearch: availableAgent.webSearch,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const agentPostgres = await postgresDB.addAgent({ agent });
    await indexedDB.addAgent({ agent: agentPostgres });
    dispatchEvent.agentAdded(agentPostgres);
    navigate(`/${agent.teamName}/${agent.name}`);
  };
  
  const thumbnails = import.meta.glob('/src/assets/thumbnails/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default'
  });
  const imageSrc = thumbnails[`/src/assets/thumbnails/${availableAgent.name}.jpg`] as string | undefined;

  return (
    <Dialog.CloseWindow>
      <div onClick={handleClick} className={styles.agentCard}>
        <img 
          src={imageSrc}
          alt={`${availableAgent.name} agent`}
          className={styles.cardImage} 
          />
        <div className={styles.cardContent}>
          <Heading variant='h5' className={styles.cardTitle}>
            {utils.capitalizeFirstLetter(availableAgent.name)}
          </Heading>
        </div>
      </div>
    </Dialog.CloseWindow>
  )
};

export default AgentCard;