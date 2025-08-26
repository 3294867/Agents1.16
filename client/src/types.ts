interface Team {
  id: string;
  name: string;
  description: string;
  userIds: string[];  
  agentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

type AgentType = 'general' | 'math' | 'geography' | 'literature'
type AgentModel = 'gpt-3.5-turbo' | 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-audio-preview' | 'chatgpt-4o'

interface Agent {
  id: string;
  type: AgentType;
  model: AgentModel;
  userId: string;
  teamId: string;
  teamName: string;
  name: string;
  systemInstructions: string;
  stack: string[] | null;
  temperature: number;
  webSearch: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NormalizedAgents {
  byId: Record<string, Agent>;
  allIds: string[];
}

type Query = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
  inferredAgentType: AgentType;
}

interface Thread {
  id: string;
  userId: string;
  agentId: string;
  title: string | null;
  body: Query[] | [];
  isActive: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
  positionY: number;
}

interface Tab {
  id: string;
  teamId: string;
  agentId: string;
  title: string | null;
  isActive: boolean;
}

interface NormalizedThreads {
  byId: Record<string, Thread>;
  allIds: string[];
}

export type {
  Team,
  AgentType,
  AgentModel,
  Agent,
  NormalizedAgents,
  Query,
  Thread,
  NormalizedThreads,
  Tab
};
