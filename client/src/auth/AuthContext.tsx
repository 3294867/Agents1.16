import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';

interface AuthContextValue {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  login: (name: string, password: string) => Promise<void>;
  signUp: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
    signUp: async (name: string, password: string) => {
      setError(null);
      const { userId } = await postgresDB.auth.signUp({ name, password });
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

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 