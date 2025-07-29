/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, cloneElement, isValidElement } from 'react';
import styles from './Tooltip.module.css';

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
} | null>(null);

export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
      <span className={styles.tooltipContainer}>{children}</span>
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ asChild, children }) => {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error('TooltipTrigger must be used within a Tooltip');
  const { setOpen, triggerRef } = ctx;

  const childProps = {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps));
  }
  return <span {...childProps}>{children}</span>;
};

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children: React.ReactNode;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ side = 'bottom', sideOffset = 4, style, children, ...props }, ref) => {
    const ctx = React.useContext(TooltipContext);
    const contentRef = useRef<HTMLDivElement>(null);

    const setRefs = (node: HTMLDivElement) => {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as React.RefObject<any>).current = node;
      contentRef.current = node;
    };
    if (!ctx) throw new Error('TooltipContent must be used within a Tooltip');
    const { open } = ctx;

    const sideClass =
      side === 'top' ? styles.tooltipContentTop :
      side === 'left' ? styles.tooltipContentLeft :
      side === 'right' ? styles.tooltipContentRight :
      styles.tooltipContentBottom;

    const className = [
      styles.tooltipContent,
      sideClass,
      open ? styles.tooltipContentVisible : '',
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={setRefs}
        role='tooltip'
        className={className}
        style={{ ...style, ['--side-offset' as any]: `${sideOffset}px` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = 'TooltipContent';
