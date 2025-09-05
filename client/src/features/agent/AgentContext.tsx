import { createContext } from 'react';

interface AgentContextType {
  userId: string;
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  isMobile: boolean;
}

const AgentContext = createContext<AgentContextType | null>(null);

export default AgentContext;