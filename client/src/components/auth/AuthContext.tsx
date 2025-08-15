import { createContext } from 'react';

export interface AuthContextValue {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  login: (name: string, password: string) => Promise<void>;
  signUp: (name: string, password: string, apiKey: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default AuthContext;