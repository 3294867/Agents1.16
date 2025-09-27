import { CSSProperties, FC, HTMLAttributes, memo, ReactNode } from 'react';
import hooks from 'src/hooks';
import utils from 'src/utils';
import Icons from 'src/assets/icons';
import styles from './Popover.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  className?: string;
  children: ReactNode;
}

const Content: FC<Props> = memo(({
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  className,
  children,
  ...props
}) => {
  const { contentRef, triggerRef, isOpen, setIsOpen } = hooks.components.usePopoverContext();
  const mounted = hooks.components.useHandleMount({ isVisible: isOpen });
  const { triggerHeight, triggerWidth } = hooks.components.useHandleTriggerSize({ triggerRef });
  const positioningClass = utils.components.getContentPositioningClass(side, align);
  
  if (!mounted) return;  

  return (
    <div
      ref={contentRef}
      role='tooltip'
      className={utils.cn(
        styles.popoverContent,
        positioningClass,
        className
      )}
      style={{
        '--trigger-height': `${triggerHeight}px`,
        '--trigger-width': `${triggerWidth}px`,
        '--side-offset': `${sideOffset}px`,
        '--align-offset': `${alignOffset}px`
      } as CSSProperties}
      {...props}
    >
      <button
        onClick={() => setIsOpen(false)}
        className={styles.popoverClose}
        aria-label='Close popover'
      >
        <Icons.Close style={{ width: '0.875rem', height: '0.875rem' }} />
      </button>
      {children}
    </div>
  );
});
Content.displayName = 'Popover.Content';

export default Content;