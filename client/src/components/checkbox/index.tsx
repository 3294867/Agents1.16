import { forwardRef, memo, useState } from 'react';
import utils from 'src/utils';
import styles from './checkbox.module.css';
import Icons from 'src/assets/icons';

type CheckedState = boolean | 'indeterminate';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  checked?: CheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
}

const Checkbox = memo(
  forwardRef<HTMLButtonElement, Props>(
    (
      { className, checked: controlledChecked, defaultChecked = false, onCheckedChange, ...props },
      ref
    ) => {
      const [uncontrolledChecked, setUncontrolledChecked] = useState<CheckedState>(
        defaultChecked
      );

      const isControlled = controlledChecked !== undefined;
      const checked: CheckedState = isControlled ? controlledChecked : uncontrolledChecked;

      const handleClick = () => {
        const next: CheckedState = checked === true ? false : true;
        if (!isControlled) setUncontrolledChecked(next);
        onCheckedChange?.(next);
      }; 

      return (
        <button
          ref={ref}
          type='button'
          role='checkbox'
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          data-state={checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
          onClick={handleClick}
          className={utils.cn(styles.checkboxContainer, className)}
          {...props}
        >
          {checked === true && <Icons.Check className={styles.icon} />}
          {checked === 'indeterminate' && <Icons.Minus className={styles.icon} />}
        </button>
      );
    }
  )
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
