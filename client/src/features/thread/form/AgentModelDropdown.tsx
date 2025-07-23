import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'src/components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from 'src/components/DropdownMenu';
import constants from 'src/constants';
import { AgentModel } from 'src/types';

interface Props {
  agentModel: AgentModel;
  setAgentModel: (model: AgentModel) => void;
};

const AgentModelDropdown = ({ agentModel, setAgentModel }: Props) => {
  const [ isOpen, setIsOpen ] = useState(false);

  const handleModelChange = (agentModel: AgentModel) => {
    setIsOpen(false);
    setAgentModel(agentModel);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          {agentModel}
          <ChevronDown className='w-4 h-4 ml-2 -mr-1'/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={4} >
        {constants.agentModels
          .filter(m => m !== agentModel)
          .map(m => (
            <Button
              key={m}
              type='button'
              onClick={() => handleModelChange(m)}
              variant='ghost'
              size='sm'
              className='w-full justify-start pl-2 text-xs hover:text-text-primary hover:bg-white/15 transition-colors duration-150'
            >
              {m}
            </Button>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AgentModelDropdown;