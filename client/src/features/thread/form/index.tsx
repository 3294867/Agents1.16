import { useState } from 'react';
import openai from 'src/opanai';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import AgentModelDropdown from './AgentModelDropdown';
import Button from 'src/components/button';
import Textarea from 'src/components/textarea';
import { AgentModel } from 'src/types';
import Icons from 'src/assets/icons';
import styles from './Form.module.css';

interface Props {
  threadId: string;
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
  threadBodyLength: number;
}

const Form = ({ threadId, agentId, agentName, agentModel: initialAgentModel, threadBodyLength }: Props) => {
  const [input, setInput] = useState<string>('');
  const [agentModel, setAgentModel] = useState<AgentModel>(initialAgentModel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    /** Create response (OpenAI) */
    const responseBody = await openai.createResponse({ agentId, agentModel, input });

    /** Infer type of an agent (OpenAI) */
    const inferredAgentType = await openai.inferAgentType({ agentId, input });
    
    /** Update thread body (PostgresDB) */
    const { requestId, responseId } = await postgresDB.addQuery({
      threadId: threadId,
      requestBody: input,
      responseBody
    });
    
    setInput('');

    if (threadBodyLength === 0) {
      /** Update thread title (OpenAI, PostgresDB, IndexedDB) */
      const threadTitle = await openai.createThreadTitle({
        question: input,
        answer: responseBody
      });
      await postgresDB.updateThreadTitle({ threadId, threadTitle });
      await indexedDB.updateThreadTitle({ threadId, threadTitle });

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
        isNew: true,
        inferredAgentType
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Ask anything...'
        spellCheck='false'
        className={styles.textarea}
      />
      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <Button type='button' variant='outline' size='sm' className={styles.addButton}>
            <Icons.Add />
          </Button>
        </div>
        <div className={styles.rightControls}>
          <AgentModelDropdown agentModel={agentModel} setAgentModel={setAgentModel} />
          <Button type='submit' variant='outline' size='icon' className={styles.sendButton}>
            <Icons.Send />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Form;
