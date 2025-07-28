interface Props {
  threadId: string;
};

/** Sets 'title' property of the thread to null (PostgresDB) */
const removeThreadTitle = async ({ threadId }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/remove-thread-title`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to remove thread title (PostresDB): ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string } = await response.json();
  if (data.message !== 'Thread title removed.') throw new Error(`Failed to remove thread title: ${data.message}`);

  } catch (error) {
    throw new Error(`Failed to remove thread title (PostresDB): ${error}`);
  }
};

export default removeThreadTitle;