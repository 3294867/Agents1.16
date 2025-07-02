export interface Agent {
  id: string;
  type: 'research' | 'code';
  model: 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-audio-preview' | 'chatgpt-4o';
  userId: string;
  name: string;
  systemInstructions: string;
  stack: string[] | null;
  temperature: number;
  webSearch: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface NormalizedAgents {
  byId: Record<string, Agent>;
  allIds: string[];
};

export type ThreadBody = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
}[] | [];

export interface Thread {
  id: string;
  userId: string;
  agentId: string;
  title: string | null;
  body: ThreadBody;
  isActive: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface NormalizedThreads {
  byId: Record<string, Thread>;
  allIds: string[];
}