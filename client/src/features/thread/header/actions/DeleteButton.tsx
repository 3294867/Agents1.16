import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Button } from 'src/components/Button';
import Icons from 'src/assets/Icons';

interface Props {
  threadId: string;
  agentName: string;
};

const DeleteButton = ({ threadId, agentName }: Props) => {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    /** Delete thread (PostgresDB) */
    await postgresDB.deleteThread({ threadId });
    
    /** Delete thread (IndexedDB) */
    await indexedDB.deleteThread({ threadId });

    /** Delete tab (localStorage) */
    tabsStorage.deleteTab(agentName, threadId)
    
    /** Navigate to the next tab */
    navigate(`/${agentName}`);
  };

  return (
    <Button variant='dropdown' onClick={handleClick}>
      <Icons.Delete style={{ marginRight: '0.5rem' }}/>
      Delete
    </Button>
  );
};

export default DeleteButton;