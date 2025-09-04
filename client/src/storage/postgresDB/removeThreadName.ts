interface Props {
  threadId: string;
}

const removeThreadName = async ({ threadId }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/remove-thread-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to remove thread name (PostresDB): ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: null } = await response.json();
  if (data.message !== 'Thread name removed') throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to remove thread name (PostresDB): ${error}`);
  }
};

export default removeThreadName;