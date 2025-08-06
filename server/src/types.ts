type AgentType = 'research' | 'code' | 'math' | 'history' | 'geography' | 'art' | 'literature';
type AgentModel = 'gpt-3.5-turbo' | 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-audio-preview' | 'chatgpt-4o';

interface Agent {
  id: string;
  type: AgentType;
  model: AgentModel;
  userId: string;
  name: string;
  systemInstructions: string;
  stack: string[] | null;
  temperature: number;
  webSearch: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface NormalizedAgents {
  byId: Record<string, Agent>;
  allIds: string[];
};

type Query = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
};

interface Thread {
  id: string;
  userId: string;
  agentId: string;
  title: string | null;
  body: Query[] | [];
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface NormalizedThreads {
  byId: Record<string, Thread>;
  allIds: string[];
};

export {
  AgentType,
  AgentModel,
  Agent,
  NormalizedAgents,
  Query,
  Thread,
  NormalizedThreads
}