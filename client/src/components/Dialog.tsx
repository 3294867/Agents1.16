import { cloneElement, createContext, FC, isValidElement, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import Icons from 'src/assets/Icons';
import styles from './Dialog.module.css';
import cn from 'src/utils/cn';

const Context = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

interface RootProps {
  children: ReactNode;
}

const Root: FC<RootProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Context.Provider value={{ isOpen, setIsOpen }}>
      <span className={cn(styles.dialogContainer)} >
        {children}
      </span>
    </Context.Provider>
  );
};

interface OverlayProps {
  isNestedInDropdown?: boolean;
}

const Overlay: FC<OverlayProps> = ({ isNestedInDropdown = false }) => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Dialog.Overlay must be within a Dialog');
  const { setIsOpen } = ctx;

  const overlay = (
    <div
      className={cn(styles.dialogOverlay)}
      onClick={isNestedInDropdown ? undefined : () => setIsOpen(false)}
    />
  );
  
  return createPortal(overlay, document.body);
};

interface TriggerProps {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<TriggerProps> = ({ asChild, children }) => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Dialog.Trigger must be within a Dialog');
  const { setIsOpen } = ctx;

  const childProps = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps));
  }

  return <span>{children}</span>;
};

interface ContentProps {
  children: ReactNode;
  open?: boolean;
  className?: string;
  isNestedInDropdown?: boolean;
}

const Content: FC<ContentProps> = ({ children, open, className, isNestedInDropdown }) => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Dialog.Content must be within a Dialog');
  const { isOpen, setIsOpen } = ctx;

  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  },[open]);

  const content = isOpen ? (
    <>
      <Overlay isNestedInDropdown={isNestedInDropdown} />
      <div className={cn(styles.dialogContent, className)}>
        <button onClick={() => setIsOpen(false)} className={styles.dialogClose}>
          <Icons.Close />
        </button>
        {children}
      </div>
    </>
  ) : null;
  
  return createPortal(content, document.body);
};

const Close: FC = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Dialog.Close must be within a Dialog');
  const { setIsOpen } = ctx;

  return (
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  );
};

const Dialog = {
  Root,
  Trigger,
  Content,
  Close,
};

export default Dialog;