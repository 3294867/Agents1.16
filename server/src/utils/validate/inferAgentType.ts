const inferAgentType = (input: string, ): string | null => {
  if (!input) {
    return "Missing required fields: input";
  }

  return null;
};

export default inferAgentType;