interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const updateThreadIsBookmarked = async ({ threadId, isBookmarked }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/update-thread-is-bookmarked`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, isBookmarked })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update 'isBookmarked' property (PostresDB): ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: null } = await response.json();
  if (data.message !== `Thread 'isBookmarked' property updated`) throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to update 'isBookmarked' property (PostresDB): ${error}`);
  }
};

export default updateThreadIsBookmarked;