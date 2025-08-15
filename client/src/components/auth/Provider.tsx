import { ReactNode, useEffect, useMemo, useState } from 'react';
import AuthContext, { AuthContextValue } from './AuthContext';
import postgresDB from 'src/storage/postgresDB';

interface Props {
  children: ReactNode;
}

const Provider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    postgresDB.auth.getCurrentUser()
      .then(({ userId }) => {
        if (mounted) setUserId(userId);
      })
      .catch(() => { /* ignore */ })
      .finally(() => setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    userId,
    isLoading,
    error,
    login: async (name: string, password: string) => {
      setError(null);
      const { userId } = await postgresDB.auth.login({ name, password });
      setUserId(userId);
    },
    signUp: async (name: string, password: string, apiKey: string) => {
      setError(null);
      const { userId } = await postgresDB.auth.signUp({ name, password, apiKey });
      setUserId(userId);
    },
    logout: async () => {
      setError(null);
      await postgresDB.auth.logout();
      setUserId(null);
    }
  }), [userId, isLoading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default Provider;