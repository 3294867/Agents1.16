import { createContext } from 'react';

const DialogContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

export default DialogContext;