import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Layout from 'src/features/layout';
import Redirect from 'src/features/Redirect';
import Agent from 'src/features/agent';
import SignUpForm from 'src/features/auth/SignUpForm';
import LogInForm from 'src/features/auth/LogInForm';
import Auth from 'src/components/auth';

const ProtectedApp = () => {
  indexedDB.initialize();
  const { userId, isLoading } = hooks.components.useAuthContext();
  hooks.features.useHandleTheme();

  const router = useMemo(() => createBrowserRouter([
    userId ? {
      path: '/',
      element: <Layout userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/personal/general'/> },
        { path: '/:teamName', element: <Redirect userId={userId} /> },
        { path: '/:teamName/:agentName', element: <Redirect userId={userId} /> },
        { path: '/:teamName/:agentName/:threadId', element: <Agent userId={userId} /> },
        { path: '/sign-up', element: <Navigate to='/personal/general' /> },
        { path: '/login', element: <Navigate to='/personal/general' /> },
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
  <Auth.Provider>
    <ProtectedApp />
  </Auth.Provider>
);

export default App;
