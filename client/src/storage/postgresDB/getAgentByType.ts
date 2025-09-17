import { Agent, AgentType } from 'src/types';

interface Props {
  agentType: AgentType;
}

const getAgentByType = async ({ agentType }: Props ): Promise<Agent | null> => {
  if (!agentType) throw new Error(`Missing required props: agentType`);
  try {
    const response = await fetch(`${import.meta.env.VITE_VITE_SERVER_URL}/api/get-agent-by-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get agent (PostgresDB): ${response.status} | ${response.statusText} - ${errorText}`);
    }

    const data: { message: string, data: Agent | null} = await response.json();
    if (!data.data) throw new Error(data.message);
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect format of the agent. Expected non-empty '{}'`);
    }

    return data.data;
  } catch (err) {
    throw new Error(`Failed to get agent name: ${err}`);
  }
};

export default getAgentByType;