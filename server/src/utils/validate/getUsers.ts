interface Props {
  input: string;
}

const getUsers = ({ input }: Props): string | null => {
  if (!input) {
    return "Missing required fields: agentType";
  }

  return null;
};

export default getUsers;