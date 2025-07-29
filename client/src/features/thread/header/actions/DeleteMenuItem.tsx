import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { DropdownMenuItem } from 'src/components/DropdownMenu';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from 'src/components/Dialog';
import { Button } from 'src/components/Button';
import { Paragraph } from 'src/components/Paragraph';

interface Props {
  threadId: string;
  agentName: string;
};

const DeleteMenuItem = ({ threadId, agentName }: Props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  
  const handleDeleteThread = async () => {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className='text-text-primary cursor-pointer'>
          <svg className='w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg>
          <p className='font-medium text-xs leading-snug'>
            Delete
          </p>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent aria-describedby='' className='focus-visible:outline-none'>
        <DialogTitle>
          Delete conversation
        </DialogTitle>
        <Paragraph variant='thin' isMuted={true}>
          Are you sure you want to delete this conversation? This action cannot be undone.
        </Paragraph>
        <div className='w-full flex justify-end '>
          <Button onClick={() => setIsOpen(false)} variant='ghost'>
            Cancel
          </Button>
          <Button onClick={handleDeleteThread}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default DeleteMenuItem;