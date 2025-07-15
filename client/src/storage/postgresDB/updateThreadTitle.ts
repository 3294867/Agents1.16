interface Request {
  threadId: string;
  threadTitle: string;
};

/**
 * Update thread title.
 * 
 * @param {string} props.threadId - Thread id.
 * @param {string} props.threadTitle - Thread title.
*/
const updateThreadTitle = async (props: Request) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/update-thread-title`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: props.threadId,
      threadTitle: props.threadTitle
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update thread title: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return null;
};

export default updateThreadTitle;