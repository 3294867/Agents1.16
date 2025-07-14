interface Request {
  question: string;
  answer: string,
};

/**
 * Create thread title.
 * 
 * @param {string} props.question - 1st question.
 * @param {string} props.answer - 1st answer.
 * @returns {string} - Response.
*/
const createThreadTitle = async (props: Request): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-thread-title`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: props.question,
      answer: props.answer
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get response: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: string } = await response.json();
  if (data.data === null) throw new Error(data.message);
  return data.data;
};

export default createThreadTitle;