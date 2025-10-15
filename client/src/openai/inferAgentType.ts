interface Props {
  input: string;
}

const inferAgentType = async ({ input }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/infer-agent-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to evaluate agent: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data;
  } catch (error) {
    throw new Error(`Failed to infer agent type (openAI): ${error}`);
  }
};

export default inferAgentType;