interface WorkspacePG {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

interface WorkspaceBE {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

type AgentType = 'general_assistant' | 'data_analyst' | 'copywriter' | 'devops_helper'
type AgentModel = 'gpt-3.5-turbo' | 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-audio-preview' | 'chatgpt-4o'

interface AgentPG {
  id: string;
  name: string;
  type: AgentType;
  model: AgentModel;
  system_instructions: string;
  stack: string[] | null;
  temperature: number;
  web_search: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AgentBE {
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

type ReqResPG = {
  request_id: string;
  response_id: string;
}

interface ThreadPG {
  id: string;
  name: string;
  body: ReqResPG[] | [];
  is_bookmarked: boolean;
  is_shared: boolean;
  created_at: Date;
  updated_at: Date;
}

type ReqResBE = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
  isNew: boolean;
}

interface ThreadBE {
  id: string;
  name: string;
  body: ReqResBE[] | [];
  isBookmarked: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export {
  WorkspacePG,
  WorkspaceBE,
  AgentType,
  AgentModel,
  AgentPG,
  AgentBE,
  ReqResPG,
  ThreadPG,
  ReqResBE,
  ThreadBE
};