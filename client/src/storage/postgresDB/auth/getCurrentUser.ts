const getCurrentUser = async (): Promise<{ userId: string | null }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-current-user`, {
      method: 'GET',
      credentials: 'include'
    });
    if (response.status === 401) return { userId: null };

    const data = await response.json();
    if (!response.ok || !data?.data) return { userId: null };
    return { userId: data.data as string };
  } catch (error) {
    console.error(error);
    return { userId: null };
  }
};

export default getCurrentUser; 