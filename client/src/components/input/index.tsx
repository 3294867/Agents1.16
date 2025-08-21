import { forwardRef, InputHTMLAttributes, memo, ReactNode } from 'react';
import utils from 'src/utils';
import styles from './Input.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={utils.cn(styles.input, className)}
        {...props}
        >
        {children}
      </input>
    );
  }
);
Input.displayName = 'Input';

export default memo(Input);
