import { memo } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown';
import constants from 'src/constants';
import { AgentModel } from 'src/types';

interface Props {
  agentModel: AgentModel;
  setAgentModel: (model: AgentModel) => void;
};

const AgentModelDropdown = memo(({ agentModel, setAgentModel }: Props) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant='outline' size='sm'>
          {agentModel}
          <Icons.ChevronDown style={{ marginLeft: '0.5rem', marginRight: '-0.25rem' }}/>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content align='end' sideOffset={4} >
        {constants.agentModels
          .filter(m => m !== agentModel)
          .map(m => (
            <Button
              key={m}
              type='button'
              onClick={() => setAgentModel(m)}
              variant='dropdown'
              size='sm'
            >
              {m}
            </Button>
          ))
        }
      </Dropdown.Content>
    </Dropdown.Root>
  );
});

export default AgentModelDropdown;