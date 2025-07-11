import Dexie, { type  EntityTable } from 'dexie';
import { useEffect, useState } from 'react';
import { Agent, Thread } from 'src/types';

const db = new Dexie('Agents') as Dexie & {
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const initDB = () => {
  db.version(1).stores({
    agents: 'id, type, model, userId, name, systemInstructions, stack, temperature, webSearch, createdAt, updatedAt',
    threads: 'id, userId, agentId, title, body, isActive, isBookmarked, createdAt, updatedAt'
  });
}

const indexedDB = {
  getAgent: (agentName: string | undefined) => {
    const [agent, setAgent] = useState<Agent | null>(null);

    useEffect(() => {
      if (!agentName) return;
      const fetchAgent = async () => {
        const agentData = await db.agents.get({ name: agentName });
        if (agentData) setAgent(agentData);
      };
      fetchAgent();
    },[db, agentName])
    return agent;
  },
  getThread: (threadId: string | undefined) => {
    const [thread, setThread] = useState<Thread | null>(null);

    useEffect(() => {
      if (!threadId) return;
      const fetchThread = async () => {
        const threadData = await db.threads.get({ id: threadId });
        if (threadData) setThread(threadData);
      };
      fetchThread();
    },[db, threadId])
    return thread;
  }
};

export { db, initDB, indexedDB };
