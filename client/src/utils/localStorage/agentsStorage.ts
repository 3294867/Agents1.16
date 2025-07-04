import { Agent } from 'src/types';

const agentsStorage = {
  save: (agents: Agent[] ): boolean => {
    try {
      localStorage.setItem(`agents`, JSON.stringify(agents));
      return true;
    } catch (error) {
      console.error('Failed to save agents: ', error);
      return false
    }
  },

  loadAgents: async (userId: string): Promise<Agent[] | null> => {
    try {
      const savedAgents = localStorage.getItem('agents');
      if (savedAgents) {
        return JSON.parse(savedAgents);
      } else {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText} - ${errorText}`);
          }

          const data: { message: string, data: Agent[] | null } = await response.json();
          if (data.data === null) {
            throw new Error(data.message);
          }

          agentsStorage.save(data.data);
          return data.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    } catch (error) {
      console.error(`Failed to load agents: `, error);
      return null;
    }
  },

  loadAgentId: (agent: string): string | null => {
    const savedAgents = localStorage.getItem('agents');
    if (savedAgents) {
      const agents = JSON.parse(savedAgents);
      const matchingAgent = agents.find((a: Agent) => a.name === agent);
      return matchingAgent ? matchingAgent.id : null;
    }
    return null;
  }

}

export default agentsStorage;