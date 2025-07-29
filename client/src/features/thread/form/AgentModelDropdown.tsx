import { ChevronDown } from 'lucide-react';
import { Button } from 'src/components/Button';
import { Dropdown, DropdownContent, DropdownTrigger } from 'src/components/Dropdown';
import constants from 'src/constants';
import { AgentModel } from 'src/types';

interface Props {
  agentModel: AgentModel;
  setAgentModel: (model: AgentModel) => void;
};

const AgentModelDropdown = ({ agentModel, setAgentModel }: Props) => {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant='outline' size='sm'>
          {agentModel}
          <ChevronDown className='w-4 h-4 ml-2 -mr-1'/>
        </Button>
      </DropdownTrigger>
      <DropdownContent align='end' sideOffset={4} >
        {constants.agentModels
          .filter(m => m !== agentModel)
          .map(m => (
            <Button
              key={m}
              type='button'
              onClick={() => setAgentModel(m)}
              variant='ghost'
              size='sm'
              className='w-full justify-start pl-2 text-xs hover:text-text-primary hover:bg-white/15 transition-colors duration-150'
            >
              {m}
            </Button>
          ))
        }
      </DropdownContent>
    </Dropdown>
  );
};

export default AgentModelDropdown;