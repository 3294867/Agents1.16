import { MoveUpRightIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import openai from 'src/responses';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Button } from 'src/components/Button';
import { Textarea } from 'src/components/Textarea';
import { AgentModel } from 'src/types';
import AgentModelDropdown from './AgentModelDropdown';

interface Props {
  threadId: string;
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
  threadBodyLength: number;
};

const Form = ({ threadId, agentId, agentName, agentModel: initialAgentModel, threadBodyLength }: Props) => {
  const [input, setInput] = useState<string>('');
  const [agentModel, setAgentModel] = useState<AgentModel>(initialAgentModel);

  const formWidth = 480;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    /** Create response (openai) */
    const responseBody = await openai.createResponse({ threadId, agentModel, input });
    
    /** Update thread body (PostgresDB) */
    const { requestId, responseId } = await postgresDB.addQuery({
      threadId: threadId,
      requestBody: input,
      responseBody
    });
    
    setInput('');

    if (threadBodyLength === 0) {
      /** Create thread title */
      const threadTitle = await openai.createThreadTitle({
        question: input,
        answer: responseBody
      });

      /** Update thread title (PostgresDB) */
      await postgresDB.updateThreadTitle({
        threadId: threadId,
        threadTitle
      });

      /** Update thread title (IndexedDB) */
      await indexedDB.updateThreadTitle({
        threadId: threadId,
        threadTitle
      });

      /** Update tabs (localStorage) */
      tabsStorage.update(agentName, agentId, threadId, threadTitle);
    }

    /** Update thread body (IndexedDB) */
    await indexedDB.addQuery({
      threadId: threadId,
      query: {
        requestId: requestId,
        requestBody: input,
        responseId: responseId,
        responseBody,
        isNew: true
      }
    });
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      style={{ transform: `translateX(calc(50% + 52px - ${formWidth/2}px))`, width: formWidth}}
      className='fixed bottom-8 space-y-2 rounded-lg shadow border border-border bg-background'
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Ask anything...'
        spellCheck='false'
        className='mt-2 focus:border-border-focus w-full resize-none border-none placeholder:text-text-tertiary text-text-primary'
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
  )
};

export default Form;
