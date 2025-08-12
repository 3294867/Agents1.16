interface Props {
  name: string;
  password: string;
}

const login = async ({ name, password }: Props): Promise<{ userId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, password })
    });

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.userId) {
      throw new Error(data?.message || 'Login failed');
    }
    return { userId: data.userId as string };
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
};

export default login; 