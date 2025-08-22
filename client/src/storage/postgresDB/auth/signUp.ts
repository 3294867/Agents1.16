interface Props {
  name: string;
  password: string;
  apiKey: string;
}

const signUp = async ({ name, password, apiKey }: Props): Promise<{ userId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, password, apiKey })
    });

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.userId) {
      throw new Error(data?.message || 'Sign up failed');
    }
    return { userId: data.userId as string };
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export default signUp; 