import { forwardRef, HTMLAttributes } from 'react';
import cn from 'src/utils/cn';
import styles from './Heading.module.css';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  role?: string;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = 'h1', ...props }, ref) => {
    const Tag =
      variant === 'h1' ? 'h1'
      : variant === 'h2' ? 'h2'
      : variant === 'h3' ? 'h3'
      : variant === 'h4' ? 'h4'
      : variant === 'h5' ? 'h5'
      : 'h6';
    
    return (
      <Tag
        ref={ref}
        className={cn(
          styles.base,
          styles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export default Heading;

