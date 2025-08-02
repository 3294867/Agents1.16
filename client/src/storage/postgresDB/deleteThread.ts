interface Props {
  threadId: string;
}

/** Deletes thread (PostgresDB) */
const deleteThread = async ({ threadId }: Props): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/delete-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error (`Failed to delete thread: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string } = await response.json();
  if (data.message !== 'Thread deleted') throw new Error('Failed to delete thread');
};

export default deleteThread;