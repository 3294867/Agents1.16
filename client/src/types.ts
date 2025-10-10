type UserRole = 'admin' | 'editor' | 'viewer'

type WorkspaceMember = {
  memberId: string;
  memberName: string;
  memberRole: 'admin' | 'editor' | 'viewer';
}

interface Workspace {
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

interface Agent {
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

type ReqRes = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
  isNew: boolean;
}

interface Thread {
  id: string;
  name: string | null;
  body: ReqRes[] | [];
  isBookmarked: boolean;
  isShared: boolean;
  isActive: boolean;
  agentId: string;
  positionY: number;
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

type NotificationType = 'workspace_invite'

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  details: object;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  UserRole,
  WorkspaceMember,
  Workspace,
  AgentType,
  AgentModel,
  Agent,
  AddAgent,
  ReqRes,
  Thread,
  Tab,
  NotificationType,
  Notification,
};

