interface Props {
  name: string;
  password: string;
}

const login = ({ name, password }: Props ): string | null => {
  if (!name) {
    return "Name is required";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};

export default login;