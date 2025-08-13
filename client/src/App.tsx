import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Layout from 'src/features/layout';
import Redirect from 'src/features/Redirect';
import Agent from 'src/features/agent';
import SignUpForm from './components/SignUpForm';
import LogInForm from './components/LogInForm';
import { AuthProvider } from './components/AuthProvider';

const ProtectedApp = () => {
  const { userId, isLoading } = hooks.useAuth();
  indexedDB.initialize();
  hooks.useHandleTheme();

  const router = useMemo(() => createBrowserRouter([
    userId ? {
      path: '/',
      element: <Layout userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/general'/> },
        { path: '/sign-up', element: <Navigate to='/general' /> },
        { path: '/login', element: <Navigate to='/general' /> },
        { path: '/:agentName', element: <Redirect userId={userId} /> },
        { path: '/:agentName/:threadId', element: <Agent userId={userId} /> }
      ]
    } : {
      path: '/*',
      element: <Navigate to='/log-in' />,
    },
    {
      path: '/sign-up',
      element: <SignUpForm />
    },
    {
      path: '/log-in',
      element: <LogInForm />
    }
  ]),[userId]);

  if (isLoading) return null;
  return <RouterProvider router={router} />;
};

const App = () => (
  <AuthProvider>
    <ProtectedApp />
  </AuthProvider>
);

export default App;
