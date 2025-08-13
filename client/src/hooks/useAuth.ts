import { useContext } from 'react';
import { AuthContext, AuthContextValue } from 'src/components/AuthProvider';

const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default useAuth;