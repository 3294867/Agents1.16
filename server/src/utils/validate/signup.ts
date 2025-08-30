const signup = (name: string, password: string, apiKey: string ): string | null => {
  if (!name) {
    return "Name is required";
  }

  if (!password) {
    return "Password is required";
  }

  if (!apiKey) {
    return "Api Key is required";
  }

  return null;
};

export default signup;