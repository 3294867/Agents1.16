type UserRole = 'admin' | 'editor' | 'viewer' 

type WorkspaceMember = {
  memberId: string;
  memberName: string;
  memberRole: 'admin' | 'editor' | 'viewer';
}

interface WorkspacePG {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

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
type AgentModel = 'gpt-4.1' | 'chatgpt-4o' | 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-5-pro'

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

interface AddAgent {
  name: string;
  type: AgentType;
  model: AgentModel;
  systemInstructions: string;
  stack: string[];
  temperature: number;
  webSearch: boolean
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

type ReqResFE = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
  isNew: boolean;
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

type NotificationTypeFE = 'workspace_invite'

interface NotificationFE {
  id: string;
  type: NotificationTypeFE;
  message: string;
  details: object;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  UserRole,
  WorkspaceMember,
  WorkspacePG,
  WorkspaceFE,
  AgentType,
  AgentModel,
  AgentPG,
  AgentFE,
  AddAgent,
  ReqResPG,
  ThreadPG,
  ReqResFE,
  ThreadFE,
  NotificationFE
};