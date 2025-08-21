import { forwardRef, LabelHTMLAttributes, memo, ReactNode } from 'react';
import utils from 'src/utils';
import styles from './Label.module.css';

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: ReactNode;
}

const Label = forwardRef<HTMLLabelElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={utils.cn(styles.label, className)}
        {...props}
        >
          {children}
      </label>
    );
  }
);
Label.displayName = 'Label';

export default memo(Label);
