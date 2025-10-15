interface Props {
  question: string;
  answer: string,
}

const createThreadName = async ({ question, answer }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/create-thread-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get thread name: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data;
  } catch (error) {
    throw new Error(`Failed to create thread name (openAI): ${error}`);
  }
};

export default createThreadName;