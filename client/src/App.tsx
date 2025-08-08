import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Layout from 'src/features/layout';
import Redirect from 'src/features/Redirect';
import Agent from 'src/features/agent';

const App = () => {
  const userId = '206776bc-6920-4f04-8580-f36b45b51e93';
  indexedDB.initialize();
  hooks.useHandleTheme();

  const router = useMemo(() => createBrowserRouter([
    {
      path: '/',
      element: <Layout userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/general'/> },
        { path: '/:agentName', element: <Redirect userId={userId} /> },
        { path: '/:agentName/:threadId', element: <Agent userId={userId} /> },
      ]
    }
  ]),[userId]);

  return <RouterProvider router={router} />;
};

export default App;
