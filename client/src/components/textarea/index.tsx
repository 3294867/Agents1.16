import { ComponentProps, forwardRef } from 'react';
import cn from 'src/utils/cn';
import styles from './Textarea.module.css'

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn( styles.textarea, className )}
        {...props}
      />
    )
})
Textarea.displayName = 'Textarea';

export default Textarea;
