import { ChevronDown, MoveUpRightIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import openai from 'src/responses';
import postgresDB from 'src/storage/postgresDB';
import newResponseStorage from 'src/storage/sessionStorage/newResponseStorage';
import { Button } from 'src/components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from 'src/components/DropdownMenu';
import { Textarea } from 'src/components/Textarea';
import { agentModels } from 'src/constants';
import { AgentModel } from 'src/types';
import { indexedDB } from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface FormProps {
  threadId: string;
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
  threadBodyLength: number;
};

const Form = (props: FormProps) => {
  const [input, setInput] = useState<string>('');
  const [agentModel, setAgentModel] = useState<AgentModel>(props.agentModel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    newResponseStorage.remove();

    /** Create response (openai) */
    const responseBody = await openai.createResponse({
      threadId: props.threadId,
      agentModel,
      input
    });

    /** Update thread body (postgresDB) */
    const responseId = await postgresDB.updateThreadBody({
      threadId: props.threadId,
      requestBody: input,
      responseBody
    });

    setInput('');

    /** Update new Response (sessionStorage) */
    newResponseStorage.add(responseId, true);

    if (props.threadBodyLength === 0) {
      /** Create thread title */
      const threadTitle = await openai.createThreadTitle({
        question: input,
        answer: responseBody
      });

      /** Update thread title (postgresDB) */
      await postgresDB.updateThreadTitle({
        threadId: props.threadId,
        threadTitle
      });

      /** Update tabs (localStorage) */
      tabsStorage.update(props.agentName, props.agentId, props.threadId, threadTitle);
    }

    /** Update thread (indexedDB) */
    const thread = await postgresDB.getThread({
      threadId: props.threadId
    });
    await indexedDB.updateThread({ thread });
  };
  
  return (
    <div className='fixed bottom-8 left-0 right-0 w-full flex justify-center'>
      <form onSubmit={handleSubmit} className='min-w-[480px] space-y-2 rounded-lg shadow border border-border bg-background'>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ask anything...'
          spellCheck='false'
          className='mt-2 focus:bg-black focus:border-border-focus w-full resize-none border-none placeholder:text-text-tertiary text-text-primary'
        />
        <div className='flex p-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <Button type='button' variant='outline' size='sm' className='h-8 w-8 p-0 rounded-full'>
              <PlusIcon className='w-4 h-4 text-text-primary/80' />
            </Button>
          </div>
          <div className='flex gap-2'>
            <AgentModelDropdown agentModel={agentModel} setAgentModel={setAgentModel} />
            <Button type='submit' variant='outline' className='h-8 w-8 p-0 rounded-full'>
              <MoveUpRightIcon className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
};

export default Form;

interface AgentModelDropdownProps {
  agentModel: AgentModel;
  setAgentModel: (model: AgentModel) => void;
};

const AgentModelDropdown = (props: AgentModelDropdownProps) => {
  const [ isOpen, setIsOpen ] = useState(false);

  const handleModelChange = (agentModel: AgentModel) => {
    setIsOpen(false);
    props.setAgentModel(agentModel);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          {props.agentModel}
          <ChevronDown className='w-4 h-4 ml-2 -mr-1'/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={4} >
        {agentModels
          .filter(m => m !== props.agentModel)
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
