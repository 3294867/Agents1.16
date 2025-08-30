const createThreadTitle = (question: string, answer: string): string | null => {
  if (!question || !answer) {
    return "Missing required fields: question, answer";
  }

  return null;
};

export default createThreadTitle;