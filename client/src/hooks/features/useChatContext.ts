import { useContext } from 'react'
import ChatContext from 'src/features/thread/chat/ChatContext'

const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be within Chat');
  return ctx;
};

export default useChatContext;