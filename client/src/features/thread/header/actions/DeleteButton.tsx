import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

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
    <button onClick={handleClick} className='h-8 text-text-button gap-2 flex items-center justify-start px-2 rounded-md focus-visible:outline-none cursor-pointer shadow-sm hover:bg-gray-100/10'>
      <svg className='w-4 h-4 mr-1' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg>
      Delete
    </button>
  )
};

export default DeleteButton;