import { createContext, RefObject } from 'react';

interface DropdownContextType {
  dropdownRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export default DropdownContext;