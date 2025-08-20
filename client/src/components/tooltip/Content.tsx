import { FC, HTMLAttributes, ReactNode } from 'react';
import useTooltipContext from './useTooltipContext';
import hooks from 'src/hooks';
import useGetSize from './useGetSize';
import cn from 'src/utils/cn';
import styles from './Tooltip.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  className?: string;
  children: ReactNode;
}

const Content: FC<Props> = ({
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  className,
  children,
  ...props
}) => {
  const { contentRef, triggerRef, isOpen, } = useTooltipContext();
  const mounted = hooks.ui.useHandleMount({ isVisible: isOpen });
  const { height: contentHeight, width: contentWidth } = useGetSize({ref: contentRef, mounted});
  const { height: triggerHeight, width: triggerWidth } = useGetSize({ref: triggerRef, mounted});

  const positioningClass =
    side === 'top' ? (
      align === 'start' ? styles.tooltipContentTopStart :
      align === 'center' ? styles.tooltipContentTopCenter :
      styles.tooltipContentTopEnd
    ) : (
      side === 'bottom' ? (
        align === 'start' ? styles.tooltipContentBottomStart :
        align === 'center' ? styles.tooltipContentBottomCenter :
        styles.tooltipContentBottomEnd
      ) : (
        side === 'right' ? (
          align === 'start' ? styles.tooltipContentRightStart :
          align === 'center' ? styles.tooltipContentRightCenter :
          styles.tooltipContentRightEnd
        ) : (
          align === 'start' ? styles.tooltipContentLeftStart :
          align === 'center' ? styles.tooltipContentLeftCenter :
          styles.tooltipContentLeftEnd
        )
      )
    );
  
  if (!mounted) return;  

  return (
    <div
      ref={contentRef}
      role='tooltip'
      className={cn(
        styles.tooltipContent,
        positioningClass,
        className
      )}
      style={{
        '--content-height': `${contentHeight}px`, 
        '--content-width': `${contentWidth}px`,
        '--trigger-height': `${triggerHeight}px`,
        '--trigger-width': `${triggerWidth}px`,
        '--side-offset': `${sideOffset}px`,
        '--align-offset': `${alignOffset}px`
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};

export default Content;