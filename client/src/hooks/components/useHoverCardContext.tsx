import { useContext } from 'react';
import HoverCardContext from 'src/components/hover-card/HoverCardContext';

const useHoverCardContext = () => {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error('useHoverCardContext must be used within a HoverCard');
  return ctx;
};

export default useHoverCardContext;