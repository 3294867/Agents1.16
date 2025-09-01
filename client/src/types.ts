type UserRole = 'admin' | 'editor' | 'viewer' 

interface WorkspaceFE {
  id: string;
  name: string;
  description: string;
  userRole: UserRole;
  agentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

type AgentType = 'general' | 'data-analyst' | 'copywriter' | 'devops-helper'
type AgentModel = 'gpt-3.5-turbo' | 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-audio-preview' | 'chatgpt-4o'

interface AgentFE {
  id: string;
  name: string;
  type: AgentType;
  model: AgentModel;
  systemInstructions: string;
  stack: string[] | [];
  temperature: number;
  webSearch: boolean;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

type ReqResFE = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

interface ThreadFE {
  id: string;
  name: string;
  body: ReqResFE[] | [];
  isBookmarked: boolean;
  isShared: boolean;
  isActive: boolean;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Tab {
  id: string;
  workspaceId: string;
  agentId: string;
  name: string | null;
  isActive: boolean;
}

export type {
  UserRole,
  WorkspaceFE,
  AgentType,
  AgentModel,
  AgentFE,
  ReqResFE,
  ThreadFE,
  Tab
};

