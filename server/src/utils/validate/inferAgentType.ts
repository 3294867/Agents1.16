interface Props {
  input: string;
}

const inferAgentType = ({ input }: Props): string | null => {
  if (!input) {
    return "Missing required fields: input";
  }

  return null;
};

export default inferAgentType;