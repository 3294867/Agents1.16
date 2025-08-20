import { createContext, RefObject } from 'react';

interface DialogContextType {
  dialogRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dialogId: string;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextType | null>(null);

export default DialogContext;