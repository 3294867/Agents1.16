interface Props {
  name: string;
  password: string;
  apiKey: string; 
}

const signup = ({ name, password, apiKey }: Props): string | null => {
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