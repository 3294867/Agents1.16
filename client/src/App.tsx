import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Redirect from 'src/features/Redirect';
import SignUpForm from 'src/features/auth/SignUpForm';
import LogInForm from 'src/features/auth/LogInForm';
import Auth from 'src/components/auth';
import Workspace from './features/workspace';
import Agent from './features/agent';

const ProtectedApp = () => {
  indexedDB.initialize();
  const { userId, isLoading } = hooks.components.useAuthContext();
  hooks.features.useHandleTheme();

  const router = useMemo(() => createBrowserRouter([
    userId ? {
      path: '/',
      element: <Workspace userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/personal/general'/> },
        { path: '/:workspaceName', element: <Redirect userId={userId} /> },
        { path: '/:workspaceName/:agentName', element: <Redirect userId={userId} /> },
        { path: '/:workspaceName/:agentName/:threadId', element: <Agent userId={userId} /> },
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

