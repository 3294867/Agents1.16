interface Props {
  threadId: string;
  threadTitle: string | null;
}

const updateThreadTitle = async ({ threadId, threadTitle }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/update-thread-title`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, threadTitle })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update thread title (PostresDB): ${response.status} ${response.statusText} - ${errorText}`);
  }

  } catch (error) {
    throw new Error(`Failed to update thread title (PostresDB): ${error}`);
  }
};

export default updateThreadTitle;