import { FC, FocusEvent, ReactNode, useRef, useState } from 'react';
import PopoverContext from './PopoverContext';
import styles from './Popover.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = (e: FocusEvent<HTMLSpanElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget && contentRef.current?.contains(relatedTarget)) {
      return;
    }

    if (relatedTarget) {
      const isPreventClose = relatedTarget.hasAttribute('data-prevent-popover-close') ||
        !!relatedTarget.closest('[data-prevent-popover-close]');
      if (isPreventClose) return;
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <PopoverContext.Provider value={{
      triggerRef,
      contentRef,
      isOpen,
      setIsOpen,
    }}>
      <span
        onBlur={(e: FocusEvent<HTMLSpanElement>) => handleBlur(e)}
        className={styles.popoverContainer}
      >
        {children}
      </span>
    </PopoverContext.Provider>
  );
};

export default Root;