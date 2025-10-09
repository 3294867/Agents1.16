import { createContext, RefObject } from 'react';

const HoverCardContext = createContext<{
  rootRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export default HoverCardContext;