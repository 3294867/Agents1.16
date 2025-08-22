import { useContext } from 'react';
import TooltipContext from '../../components/tooltip/TooltipContext';


const useTooltipContext = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('useTooltipContext must be used within a Tooltip');
  return ctx;
};

export default useTooltipContext;