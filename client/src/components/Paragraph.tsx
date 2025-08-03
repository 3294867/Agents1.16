import * as React from 'react';
import cn from 'src/utils/cn';
import styles from './Paragraph.module.css';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'thin' | 'thick';
  size?: 'sm' | 'base';
  isMuted?: boolean;
  role?: string;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
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