import { useContext } from 'react';
import AuthContext, { AuthContextValue } from '../../components/auth/AuthContext';

const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within Auth.Provider');
  return ctx;
};

export default useAuthContext;