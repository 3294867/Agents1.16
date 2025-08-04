import { forwardRef, HTMLAttributes } from 'react';
import cn from 'src/utils/cn';
import styles from './Paragraph.module.css';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'thin' | 'thick';
  size?: 'sm' | 'base';
  isMuted?: boolean;
  role?: string;
}

const Paragraph = forwardRef<HTMLParagraphElement, Props>(
  ({ className, variant = 'thin', size = 'sm', isMuted = false, ...props }, ref) => {
    const isMutedClass = isMuted ? styles.isMuted : '';
    
    return (
      <p
        ref={ref}
        className={cn(
          styles.base,
          styles[variant],
          styles[size],
          isMutedClass,
          className
        )}
        {...props}
      />
    );
  }
);
Paragraph.displayName = 'Paragraph';

export default Paragraph;