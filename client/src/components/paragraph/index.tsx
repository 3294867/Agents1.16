import { forwardRef, HTMLAttributes } from 'react';
import utils from 'src/utils';
import styles from './Paragraph.module.css';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'thin' | 'thick';
  size?: 'xs' | 'sm' | 'base';
  isMuted?: boolean;
  role?: string;
}

const Paragraph = forwardRef<HTMLParagraphElement, Props>(
  ({ className, variant = 'thin', size = 'sm', isMuted = false, ...props }, ref) => {
    const isMutedClass = isMuted ? styles.isMuted : '';
    return (
      <p
        ref={ref}
        className={utils.cn(
          styles.root,
          styles[size],
          styles[variant],
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