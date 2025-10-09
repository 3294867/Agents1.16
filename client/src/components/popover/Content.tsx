import { CSSProperties, FC, memo, ReactNode } from 'react';
import hooks from 'src/hooks';
import utils from 'src/utils';
import styles from './Popover.module.css';

interface Props {
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
}) => {
  const { triggerRef, contentRef, isOpen } = hooks.components.usePopoverContext();
  const { isMounted } = hooks.components.useHandleMount({ isOpen });
  const positioningClass = utils.components.getContentPositioningClass(side, align);
  const { triggerHeight, triggerWidth } = hooks.components.useHandleTriggerSize({ triggerRef });

  const props = {
    ref: contentRef,
    className: utils.cn(styles.popoverContent, positioningClass, className),
    style: {
      '--trigger-height': `${triggerHeight}px`,
      '--trigger-width': `${triggerWidth}px`,
      '--side-offset': `${sideOffset}px`,
      '--align-offset': `${alignOffset}px`
    } as CSSProperties,
  };

  if (!isMounted) return null;

  return (
    <div {...props}>
      {children}
    </div>
  );
});
Content.displayName = 'Popover.Content';

export default Content;