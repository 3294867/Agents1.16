import { createContext } from 'react';

interface ChatContextType {
  progressBarLength: number;
  setProgressBarLength: (progressBarLength: number) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;