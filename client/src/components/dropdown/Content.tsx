import { CSSProperties, FC, HTMLAttributes, memo, ReactNode } from 'react';
import hooks from 'src/hooks';
import utils from 'src/utils';
import styles from './Dropdown.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
}

const Content: FC<Props> = memo(({ side = 'bottom', sideOffset = 4, align = 'start', children, ...props }) => {
  const { dropdownRef, isOpen, setIsOpen } = hooks.components.useDropdownContext();
  hooks.components.useHandleDropdownFocusOnOpen({ dropdownRef, isOpen });
  hooks.components.useHandleEscapeKey({ isOpen, setIsOpen });
  hooks.components.useHandleDropdownEnterKey({ dropdownRef, isOpen, setIsOpen, });
  hooks.components.useHandleDropdownTabKey({ dropdownRef, isOpen });

  if (!isOpen) return null;

  const sideClass =
    side === 'top' ? styles.dropdownContentTop :  
    side === 'left' ? styles.dropdownContentLeft :
    side === 'right' ? styles.dropdownContentRight :
    styles.dropdownContentBottom;
  
  const alignClass =
    align === 'start' ? styles.dropdownContentStart :
    align === 'center' ? styles.dropdownContentCenter :
    styles.dropdownContentEnd;
  
  return (
    <div
      ref={dropdownRef}
      role='menu'
      className={utils.cn(
        styles.dropdownContent,
        sideClass,
        alignClass,
        styles.dropdownContentVisible
      )}
      style={{ '--side-offset': `${sideOffset}px` } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});

export default Content;