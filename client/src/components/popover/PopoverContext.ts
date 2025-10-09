import { createContext, RefObject } from 'react';

const PopoverContext = createContext<{
  rootRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

export default PopoverContext;