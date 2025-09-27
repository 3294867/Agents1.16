import { memo, useState } from 'react';
import hooks from 'src/hooks';
import Answer from './Answer';
import Question from './question';
import ChatContext from './ChatContext';
import styles from './Chat.module.css';

const Chat = memo(() => {
  const [progressBarLength, setProgressBarLength] = useState(0);
  const { threadBody } = hooks.features.useThreadContext();
  
  const chatContext = {
    progressBarLength,
    setProgressBarLength
  };

  return (
    <ChatContext.Provider value={chatContext}>
      <div id='chat' className={styles.chat}>
        {threadBody.length > 0 && threadBody.map((i, idx) => (
          <div key={idx} className={styles.messageGroup}>
            <Question key={i.requestId} reqres={i} />
            <Answer
              requestId={i.requestId}
              responseId={i.responseId}
              responseBody={i.responseBody}
              inferredAgentType={i.inferredAgentType}
              isNew={i.isNew}
              />
          </div>
        ))}
      </div>
    </ChatContext.Provider>
  );
});

export default Chat;
