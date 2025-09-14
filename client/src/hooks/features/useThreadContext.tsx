import { useContext } from 'react';
import ThreadContext from 'src/features/thread/ThreadContext';

const useThreadContext = () => {
  const ctx = useContext(ThreadContext);
  if (!ctx) throw new Error('useThreadContext must be within a Thread');
  return ctx;
};

export default useThreadContext;
