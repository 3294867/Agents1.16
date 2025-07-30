/* eslint-disable @typescript-eslint/no-explicit-any*/
import { cloneElement, createContext, FC, isValidElement, ReactElement, ReactNode, useContext, useState } from 'react';
import styles from './Dialog.module.css';

const DialogContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

const Dialog: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      <span className={styles.dialogContainer}>
        {children}
      </span>
    </DialogContext.Provider>
  );
};

const DialogOverlay: FC = () => {
  return <div className={styles.dialogOverlay} />;
};

interface DialogTriggerProps {
  asChild?: boolean;
  children: ReactElement;
}

const DialogTrigger: FC<DialogTriggerProps> = ({ asChild, children }) => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('DialogTrigger must be within a Dialog');
  const { setIsOpen } = ctx;

  const childProps = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps));
  }

  return <span>{children}</span>
};

interface DialogContentProps {
  children: ReactNode;
}

const DialogContent: FC<DialogContentProps> = ({ children }) =>  {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('DialogContent must be within a Dialog');
  const { isOpen, setIsOpen } = ctx;

  return isOpen && (
    <>
      <DialogOverlay />
      <div className={styles.dialogContent}>
        <button onClick={() => setIsOpen(false)} className={styles.dialogClose}>
          <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg>
        </button>
        {children}
      </div>
    </>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent
};

