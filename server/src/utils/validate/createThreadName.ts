interface Props {
  question: string;
  answer: string;
}

const createThreadName = ({ question, answer }: Props): string | null => {
  if (!question || !answer) {
    return "Missing required fields: question, answer";
  }

  return null;
};

export default createThreadName;