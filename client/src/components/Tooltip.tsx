/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, cloneElement, isValidElement, ReactNode, createContext, useContext, forwardRef, FC, RefObject, ReactElement, HTMLAttributes } from 'react';
import cn from 'src/utils/cn';
import styles from './Tooltip.module.css';

const Context = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
} | null>(null);

interface RootProps {
  children: ReactNode;
}

const Root: FC<RootProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <Context.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <span className={styles.tooltipContainer}>{children}</span>
    </Context.Provider>
  );
};

interface TriggerProps {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<TriggerProps> = ({ asChild, children }) => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Tooltip.Trigger must be used within a Tooltip');
  const { setIsOpen, triggerRef } = ctx;

  const childProps = {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    onMouseEnter: () => setIsOpen(true),
    onMouseLeave: () => setIsOpen(false),
    onFocus: () => setIsOpen(true),
    onBlur: () => setIsOpen(false),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps));
  }
  return <span {...childProps}>{children}</span>;
};

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children: ReactNode;
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ side = 'bottom', sideOffset = 4, style, children, ...props }, ref) => {
    const ctx = useContext(Context);
    const contentRef = useRef<HTMLDivElement>(null);

    const setRefs = (node: HTMLDivElement) => {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as RefObject<any>).current = node;
      contentRef.current = node;
    };
    if (!ctx) throw new Error('Tooltip.Content must be used within a Tooltip');
    const { isOpen } = ctx;

    const sideClass =
      side === 'top' ? styles.tooltipContentTop :
      side === 'left' ? styles.tooltipContentLeft :
      side === 'right' ? styles.tooltipContentRight :
      styles.tooltipContentBottom;

    return (
      <div
        ref={setRefs}
        role='tooltip'
        className={cn(
          styles.tooltipContent,
          sideClass,
          isOpen && styles.tooltipContentVisible,
        )}
        style={{ ...style, ['--side-offset' as any]: `${sideOffset}px` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Content.displayName = 'Tooltip.Content';

const Tooltip = {
  Root,
  Trigger,
  Content
};

export default Tooltip;