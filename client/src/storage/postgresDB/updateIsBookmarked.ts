interface Props {
  threadId: string;
  isBookmarked: boolean;
}

/** Updates 'isBookmarked' property of the thread (PostgresDB) */
const updatedThreadIsBookmarked = async ({ threadId, isBookmarked }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/update-thread-is-bookmarked`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, isBookmarked })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update 'isBookmarked' property (PostresDB): ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string } = await response.json();
  if (data.message !== `'isBookmarked' property of the thread updated`) {
    throw new Error(`Failed to update thread 'isBookmarked' property of the thread`);
  }

  } catch (error) {
    throw new Error(`Failed to update 'isBookmarked' property (PostresDB): ${error}`);
  }
};

export default updatedThreadIsBookmarked;