const login = (name: string, password: string ): string | null => {
  if (!name) {
    return "Name is required";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};

export default login;