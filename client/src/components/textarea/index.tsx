import { ComponentProps, forwardRef } from 'react';
import utils from 'src/utils';
import styles from './Textarea.module.css'

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={utils.cn( styles.textarea, className )}
        {...props}
      />
    )
})
Textarea.displayName = 'Textarea';

export default Textarea;
