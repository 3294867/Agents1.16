interface Props {
  name: string;
  password: string;
}

const signUp = async ({ name, password }: Props): Promise<{ userId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, password })
    });

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.userId) {
      throw new Error(data?.message || 'Sign up failed');
    }
    return { userId: data.userId as string };
  } catch (error) {
    throw new Error(`Sign up failed: ${error}`);
  }
};

export default signUp; 