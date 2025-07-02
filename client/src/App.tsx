import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import StoreProvider from './redux/StoreProvider';
import { TooltipProvider } from './components/Tooltip';
import Layout from './features/layout';
import Redirect from './Redirect';
import Agent from "./features/agent";
import { useHandleTheme } from './hooks/useHandleTheme';

const App = () => {
  const userId = '79fa0469-8a88-4bb0-9bc5-3623b09cf379';
  useHandleTheme();
  
  const router = useMemo(() => createBrowserRouter([
    {
      path: '/',
      element: <Layout userId={userId} />,
      children: [
        { path: '/', element: <Navigate to='/research'/> },
        { path: '/:agent', element: <Redirect userId={userId} /> },
        { path: '/:agent/:threadId', element: <Agent userId={userId} /> },
      ]
    }
  ]),[userId]);

  return (
    <StoreProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </StoreProvider>
  )
};

export default App;
