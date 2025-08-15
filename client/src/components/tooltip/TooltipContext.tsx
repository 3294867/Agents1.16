import { createContext, RefObject } from 'react';

const TooltipContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
} | null>(null);

export default TooltipContext;