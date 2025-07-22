import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import Layout from 'src/features/layout';
import Redirect from 'src/features/Redirect';
import Agent from 'src/features/agent';
import { TooltipProvider } from 'src/components/Tooltip';

const App = () => {
  const userId = '79fa0469-8a88-4bb0-9bc5-3623b09cf379';
  indexedDB.initialize();
  hooks.useHandleTheme();

  const router = useMemo(() => createBrowserRouter([
    {
      path: '/',
      element: <Layout userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/research'/> },
        { path: '/:agentName', element: <Redirect userId={userId} /> },
        { path: '/:agentName/:threadId', element: <Agent userId={userId} /> },
      ]
    }
  ]),[userId]);

  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  )
};

export default App;
