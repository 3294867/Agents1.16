interface Props {
  question: string;
  answer: string;
}

const createThreadTitle = ({ question, answer }: Props): string | null => {
  if (!question || !answer) {
    return "Missing required fields: question, answer";
  }

  return null;
};

export default createThreadTitle;