import { CSSProperties, FC, HTMLAttributes, memo, ReactNode } from 'react';
import hooks from 'src/hooks';
import utils from 'src/utils';
import styles from './HoverCard.module.css';

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
  const { contentRef, triggerRef, isOpen } = hooks.components.useHoverCardContext();
  const { isMounted } = hooks.components.useHandleMount({ isOpen });
  const { triggerHeight, triggerWidth } = hooks.components.useHandleTriggerSize({ triggerRef });
  const positioningClass = utils.components.getContentPositioningClass(side, align);
  
  if (!isMounted) return;  

  return (
    <div
      ref={contentRef}
      className={utils.cn(
        styles.hoverCardContent,
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
      {children}
    </div>
  );
});
Content.displayName = 'HoverCard.Content';

export default Content;