import { createContext, RefObject } from 'react';

const TooltipContext = createContext<{
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export default TooltipContext;