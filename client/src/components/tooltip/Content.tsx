/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, HTMLAttributes, ReactNode, RefObject, useRef } from 'react';
import useTooltipContext from './useTooltipContext';
import styles from './Tooltip.module.css';
import cn from 'src/utils/cn';

interface Props extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children: ReactNode;
}

const Content = forwardRef<HTMLDivElement, Props>(
  ({ side = 'bottom', sideOffset = 4, style, children, ...props }, ref) => {
    const { isOpen } = useTooltipContext();
    const contentRef = useRef<HTMLDivElement>(null);

    const setRefs = (node: HTMLDivElement) => {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as RefObject<any>).current = node;
      contentRef.current = node;
    };


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

export default Content;