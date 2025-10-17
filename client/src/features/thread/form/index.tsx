import { memo, useState } from 'react';
import openai from 'src/openai';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import AgentModelDropdown from './AgentModelDropdown';
import Button from 'src/components/button';
import Textarea from 'src/components/textarea';
import { AgentModel, AgentType } from 'src/types';
import Icons from 'src/assets/icons';
import styles from './Form.module.css';

const Form = memo(() => {
  const {
    workspaceName,
    agentId,
    agentName,
    agentModel: initialAgentModel,
    threadId,
    threadBodyLength
  } = hooks.features.useThreadContext();
  const [input, setInput] = useState<string>('');
  const [agentModel, setAgentModel] = useState<AgentModel>(initialAgentModel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    /** Create response (OpenAI) */
    const { type: responseType, output: responseBody } = await openai.createResponse({ agentId, agentModel, input });

    /** Infer type of an agent (OpenAI) */
    const inferredAgentType = await openai.inferAgentType({ input }) as AgentType;
    
    /** Update thread body (PostgresDB) */
    const { requestId, responseId } = await postgresDB.addReqRes({
      threadId,
      requestBody: input,
      responseBody,
      responseType
    });
    
    setInput('');

    if (threadBodyLength === 0) {
      /** Update 'name' property of the thread (OpenAI, PostgresDB, IndexedDB) */
      const threadName = await openai.createThreadName({
        question: input,
        answer: responseBody
      });
      await postgresDB.updateThreadName({ threadId, threadName });
      await indexedDB.updateThreadName({ threadId, threadName });

      /** Update tabs (localStorage) */
      tabsStorage.updateName({ workspaceName, agentName, tabId: threadId, tabName: threadName });
    }

    /** Update thread body (IndexedDB) */
    await indexedDB.addReqRes({
      threadId: threadId,
      reqres: {
        requestId: requestId,
        requestBody: input,
        responseId: responseId,
        responseBody,
        responseType,
        inferredAgentType,
        isNew: true
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
});

export default Form;
