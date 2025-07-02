import { Link, useParams } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/Tooltip';
import { Agent } from 'src/types';
import { PlusIcon } from 'lucide-react';

interface AgentsProps {
  userId: string;
  agents: Agent[];
}

const Agents = (props: AgentsProps) => {
  const { agent } = useParams();

  return (
    <div className='flex flex-col gap-2 mt-28'>
      {props.agents.map(a => (
        <Tooltip key={a.name}>
          <TooltipTrigger asChild>
            <Link prefetch='intent' to={`/${a.name}`}> 
              <Button variant='outline' size='icon' className={`
                rounded-full
                ${agent === a.name ? 'bg-blue-600 hover:bg-blue-600/80' : ''}
              `}>
                {a.name[0].toUpperCase()}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={12}>
            {a.name}
          </TooltipContent>
        </Tooltip>
      ))}
      <Button variant='outline' size='icon' className='rounded-full'>
        <PlusIcon className='w-4 h-4'/>
      </Button>
    </div>
  )
};

export default Agents;
