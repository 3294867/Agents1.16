interface WorkspaceJS {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  name: string;
  type: AgentType;
  model: AgentModel;
  systemInstructions: string;
  stack: string[] | null;
  temperature: number;
  webSearch: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentJS {
  id: string;
  name: string;
  type: AgentType;
  model: AgentModel;
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
}

interface Thread {
  id: string;
  userId: string;
  agentId: string;
  title: string | null;
  body: Query[] | [];
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NormalizedThreads {
  byId: Record<string, Thread>;
  allIds: string[];
}

type QueryPG = {
  request_id: string;
  response_id: string;
}

interface ThreadPG {
  id: string;
  name: string;
  body: QueryPG[] | [];
  is_bookmarked: boolean;
  is_shared: boolean;
  created_at: Date;
  updated_at: Date;
}

type QueryJS = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
  isNew: boolean;
}

interface ThreadJS {
  id: string;
  name: string;
  body: QueryJS[] | [];
  isBookmarked: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export {
  WorkspaceJS,
  Team,
  AgentType,
  AgentModel,
  Agent,
  AgentJS,
  NormalizedAgents,
  Query,
  Thread,
  NormalizedThreads,
  QueryPG,
  ThreadPG,
  QueryJS,
  ThreadJS
};