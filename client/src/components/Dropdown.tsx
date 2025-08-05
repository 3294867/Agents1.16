/* eslint-disable @typescript-eslint/no-explicit-any*/
import { cloneElement, createContext, FC, forwardRef, HTMLAttributes, isValidElement, ReactElement, ReactNode, useContext, useState } from 'react';
import cn from 'src/utils/cn';
import styles from './Dropdown.module.css';

const Context = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const Root: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (relatedTarget) {
      const isPreventClose = relatedTarget.hasAttribute('data-prevent-dropdown-close') ||
        !!relatedTarget.closest('[data-prevent-dropdown-close]');
      if (isPreventClose) return;
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <Context.Provider value={{ isOpen, setIsOpen }}>
      <span onBlur={(e: React.FocusEvent<HTMLSpanElement>) => handleBlur(e)} className={styles.dropdownContainer}>
        {children}
      </span>
    </Context.Provider>
  );
};

interface TriggerProps {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<TriggerProps> = ({ asChild, children }) => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Dropdown.Trigger must be used within a Dropdown');
  const { setIsOpen } = ctx;

  const childProps = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps))
  }
  
  return <span>{children}</span>
};

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ side = 'bottom', sideOffset = 4, align = 'start', style, children, ...props }, ref) => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error('Dropdown.Content must be used within a Dropdown');
    const { isOpen } = ctx;

    if (!isOpen) return null;

    const sideClass =
      side === 'top' ? styles.dropdownContentTop :
      side === 'left' ? styles.dropdownContentLeft :
      side === 'right' ? styles.dropdownContentRight :
      styles.dropdownContentBottom;
    
    const alignClass =
      align === 'start' ? styles.dropdownContentStart :
      align === 'center' ? styles.dropdownContentCenter :
      styles.dropdownContentEnd;
    
    return (
      <div
        ref={ref}
        className={cn(
          styles.dropdownContent,
          sideClass,
          alignClass,
          styles.dropdownContentVisible
        )}
        style={{ ...style, ['--side-offset' as any]: `${sideOffset}px` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Content.displayName = 'Dropdown.Content';

const Dropdown = {
  Root,
  Trigger,
  Content,
};

export default Dropdown;
