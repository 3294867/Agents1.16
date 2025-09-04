interface Props {
  threadId: string;
  threadName: string | null;
}

const updateThreadName = async ({ threadId, threadName }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/update-thread-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, threadName })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update thread name (PostresDB): ${response.status} ${response.statusText} - ${errorText}`);
  }
  const data: { message: string, data: null } = await response.json();
  if (data.message !== 'Thread name updated') throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to update thread name (PostresDB): ${error}`);
  }
};

export default updateThreadName;