/* eslint-disable @typescript-eslint/no-explicit-any*/
import { cloneElement, createContext, FC, forwardRef, HTMLAttributes, isValidElement, ReactElement, ReactNode, useContext, useState } from 'react';
import styles from './Dropdown.module.css';

const DropdownContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const Dropdown: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <span onBlur={handleBlur} className={styles.dropdownContainer}>
        {children}
      </span>
    </DropdownContext.Provider>
  );
};

interface DropdownTriggerProps {
  asChild?: boolean;
  children: ReactElement;
}

const DropdownTrigger: FC<DropdownTriggerProps> = ({ asChild, children }) => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownTrigger must be used within a Dropdown');
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

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ side = 'bottom', sideOffset = 4, align = 'start', style, children, ...props }, ref) => {
    const ctx = useContext(DropdownContext);
    if (!ctx) throw new Error('DropdownContent must be used within a Dropdown');
    const { isOpen } = ctx;

    const sideClass =
      side === 'top' ? styles.dropdownContentTop :
      side === 'left' ? styles.dropdownContentLeft :
      side === 'right' ? styles.dropdownContentRight :
      styles.dropdownContentBottom;
    
    const alignClass =
      align === 'start' ? styles.dropdownContentStart :
      align === 'center' ? styles.dropdownContentCenter :
      styles.dropdownContentEnd;
    
    const className = [
      styles.dropdownContent,
      sideClass,
      alignClass,
      isOpen ? styles.dropdownContentVisible : styles.dropdownContentNotVisible,
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={className}
        style={{ ...style, ['--side-offset' as any]: `${sideOffset}px` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownContent.displayName = 'DropdownContent';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent
};