import { FC, ReactNode, useRef, useState } from 'react';
import PopoverContext from './PopoverContext';
import styles from './Popover.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <PopoverContext.Provider value={{
      triggerRef,
      contentRef,
      isOpen,
      setIsOpen,
    }}>
      <span className={styles.popoverContainer}>{children}</span>
    </PopoverContext.Provider>
  );
};

export default Root;