interface Agent {
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

interface NormalizedAgents {
  byId: Record<string, Agent>;
  allIds: string[];
};

type ThreadBody = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
}[] | [];

interface Thread {
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

interface Tab {
  id: string;
  agentId: string;
  title: string | null;
  isActive: boolean;
};

interface NormalizedThreads {
  byId: Record<string, Thread>;
  allIds: string[];
};

export type { Agent, NormalizedAgents, ThreadBody, Thread, NormalizedThreads, Tab  };
