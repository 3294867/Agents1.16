const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Logout failed: ${text}`);
    }
  } catch (error) {
    throw new Error(`Logout failed: ${error}`);
  }
};

export default logout; 