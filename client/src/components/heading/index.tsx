import { forwardRef, HTMLAttributes } from 'react';
import utils from 'src/utils';
import styles from './Heading.module.css';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  role?: string;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = 'h1', ...props }, ref) => {
    const Tag = utils.components.getHeadingTag(variant);
    
    return (
      <Tag
        ref={ref}
        className={utils.cn(
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

