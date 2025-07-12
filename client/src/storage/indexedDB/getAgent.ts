import { useEffect, useState } from 'react';
import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

const getAgent = (agentName: string | undefined) => {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (!agentName) return;
    const fetchAgent = async () => {
      const agentData = await db.agents.get({ name: agentName });
      if (agentData) setAgent(agentData);
    };
    fetchAgent();
  },[agentName]);
  
  return agent;
};

export default getAgent;