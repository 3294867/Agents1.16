/* eslint-disable @typescript-eslint/no-explicit-any*/
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import useDropdownContext from './useDropdownContext';
import styles from './Dropdown.module.css';
import cn from 'src/utils/cn';


interface Props extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
}

const Content = forwardRef<HTMLDivElement, Props>(
  ({ side = 'bottom', sideOffset = 4, align = 'start', style, children, ...props }, ref) => {
    const { isOpen } = useDropdownContext();

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

export default Content;