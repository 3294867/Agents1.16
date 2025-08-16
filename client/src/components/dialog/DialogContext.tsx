import { createContext, RefObject } from 'react';

interface DialogContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dialogRef: RefObject<HTMLDivElement | null>;
  dialogId: string;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextType | null>(null);

export default DialogContext;