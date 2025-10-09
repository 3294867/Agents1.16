import { useContext } from 'react';
import PopoverContext from 'src/components/popover/PopoverContext';

const usePopoverContext = () => {
  const ctx = useContext(PopoverContext)
  if (!ctx) throw new Error('usePopoverContext must be used within a Popover'); 
  return ctx;
};

export default usePopoverContext;