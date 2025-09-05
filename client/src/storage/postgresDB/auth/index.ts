import getCurrentUser from './getCurrentUser';
import login from './login';
import logout from './logout';
import signUp from './signUp';

const auth = {
  getCurrentUser,
  login,
  signUp,
  logout
};

export default auth;