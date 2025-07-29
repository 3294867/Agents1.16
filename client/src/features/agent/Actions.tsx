import { CogIcon, EllipsisVerticalIcon, FolderClosedIcon, HistoryIcon } from 'lucide-react';
import { Button } from 'src/components/Button';
import { Dropdown, DropdownContent, DropdownTrigger } from 'src/components/Dropdown';

interface Props {
  userId: string;
  agentId: string;
};

const Actions = ({ userId, agentId }: Props) => {
  return (
    <div className='flex gap-1.5 items-center'>
      <Button variant='outline' size='icon' className='w-8 h-8 p-0 rounded-full'>
        <HistoryIcon className='w-4 h-4' />
      </Button>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant='outline' size='icon' className='w-8 h-8 p-0 rounded-full'>
            <EllipsisVerticalIcon className='size-4' />
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          <Button variant='outline' size='icon' className='w-full justify-start pl-2 text-xs hover:text-text-primary hover:bg-white/15 transition-colors duration-150'>
            <FolderClosedIcon className='mr-2 w-4 h-4 text-text-primary/80' />
            Library
          </Button>
          <Button variant='outline' size='icon' className='w-full justify-start pl-2 text-xs hover:text-text-primary hover:bg-white/15 transition-colors duration-150'>
            <CogIcon className='mr-2 w-4 h-4 text-text-primary/80' />
            Settings
          </Button>
        </DropdownContent>
      </Dropdown>
    </div>    
  )
};

export default Actions;