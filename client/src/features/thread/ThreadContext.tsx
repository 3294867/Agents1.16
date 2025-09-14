import { createContext } from 'react';
import { AgentModel, AgentType, ReqRes } from 'src/types';

export interface ThreadContextType {
  userId: string;
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  agentModel: AgentModel;
  threadId: string;
  threadName: string | null;
  threadBody: ReqRes[] | [];
  threadBodyLength: number;
  threadIsBookmarked: boolean;
  threadIsShared: boolean;
  threadIsActive: boolean;
  threadPositionY: number;
  isMobile: boolean;
}

const ThreadContext = createContext<ThreadContextType | null>(null);

export default ThreadContext;