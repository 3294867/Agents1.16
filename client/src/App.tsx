import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from './components/Tooltip';
import Layout from './features/layout';
import Redirect from './Redirect';
import Agent from "./features/agent";
import { useHandleTheme } from './hooks/useHandleTheme';
import initializeIndexedDB from './utils/indexedDB/initializeIndexedDB';

const App = () => {
  const userId = '79fa0469-8a88-4bb0-9bc5-3623b09cf379';
  initializeIndexedDB();
  useHandleTheme();

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
