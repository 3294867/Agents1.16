import { createContext, RefObject } from 'react';

const PopoverContext = createContext<{
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export default PopoverContext;