import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Layout from 'src/features/layout';
import Redirect from 'src/features/Redirect';
import Agent from 'src/features/agent';
import { AuthProvider, useAuth } from 'src/auth/AuthContext';
import LoginForm from 'src/auth/LoginForm';

const ProtectedApp = () => {
  const { userId, isLoading } = useAuth();
  indexedDB.initialize();
  hooks.useHandleTheme();

  const router = useMemo(() => createBrowserRouter([
    userId ? {
      path: '/',
      element: <Layout userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/general'/> },
        { path: '/:agentName', element: <Redirect userId={userId} /> },
        { path: '/:agentName/:threadId', element: <Agent userId={userId} /> },
      ]
    } : {
      path: '/',
      element: <Navigate to='/auth' />
    },
    {
      path: '/auth',
      element: <LoginForm />
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
