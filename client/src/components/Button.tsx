import { ButtonHTMLAttributes, cloneElement, forwardRef, isValidElement, memo, ReactNode }from 'react';
import styles from './Button.module.css';
import cn from 'src/utils/cn';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'alert' | 'link' | 'dropdown';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isPressed?: boolean;
  className?: string;
  asChild?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'default', size = 'default', isPressed = false, className, asChild, children, ...props }, ref) => {
    
    const variantClass =
      variant === 'default' ? styles.defaultVariant :
      variant === 'secondary' ? styles.secondaryVariant :
      variant === 'outline' ? styles.outlineVariant :
      variant === 'ghost' ? styles.ghostVariant :
      variant === 'alert' ? styles.alertVariant :
      variant === 'link' ? styles.linkVariant :
      styles.dropdownVariant;

    const sizeClass =
      size === 'default' ? styles.defaultSize :
      size === 'sm' ? styles.smSize :
      size === 'lg' ? styles.lgSize :
      styles.iconSize;
    
    const isPressedClass = isPressed ? styles.isPressed : '';  
    
    if (asChild && isValidElement(children)) {
      return cloneElement(children, Object.assign(
        {},
        children.props,
        cn(styles.base, variantClass, sizeClass, isPressedClass, className)
      ));
    }
    
    return (
      <button
        ref={ref}
        className={cn( styles.base, variantClass, sizeClass, isPressedClass, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default memo(Button);