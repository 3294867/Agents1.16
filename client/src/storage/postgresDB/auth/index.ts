import getCurrentUser from './getCurrentUser';
import login from './login';
import logout from './logout';
import signUp from './signUp';

export const postgresDB = {
  getCurrentUser,
  login,
  signUp,
  logout
};
