import { FC, FocusEvent, memo, ReactNode, useRef, useState } from 'react';
import DropdownContext from './DropdownContext';
import styles from './Dropdown.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = memo(({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = (e: FocusEvent<HTMLSpanElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget && dropdownRef.current?.contains(relatedTarget)) {
      return;
    }
    
    if (relatedTarget) {
      const isPreventClose = relatedTarget.hasAttribute('data-prevent-dropdown-close') ||
        !!relatedTarget.closest('[data-prevent-dropdown-close]');
      if (isPreventClose) return;
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <DropdownContext.Provider value={{ dropdownRef, isOpen, setIsOpen }}>
      <span onBlur={(e: FocusEvent<HTMLSpanElement>) => handleBlur(e)} className={styles.dropdownContainer}>
        {children}
      </span>
    </DropdownContext.Provider>
  );
});

export default Root;