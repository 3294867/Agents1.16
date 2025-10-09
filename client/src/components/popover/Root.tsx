import { FC, memo, ReactNode, useRef, useState } from 'react';
import PopoverContext from './PopoverContext';
import styles from './Popover.module.css';
import hooks from 'src/hooks';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = memo(({ children }) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  hooks.components.useHandleClickOutside({ rootRef, contentRef, setIsOpen });

  return (
    <PopoverContext.Provider value={{
      rootRef,
      triggerRef,
      contentRef,
      isOpen,
      setIsOpen
    }}>
      <span ref={rootRef} className={styles.popoverRoot}>
        {children}
      </span>
    </PopoverContext.Provider>
  );
});
Root.displayName = 'Popover.Root';

export default Root;