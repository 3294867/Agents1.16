import { FC, memo, MouseEvent, ReactNode, useRef, useState } from 'react';
import HoverCardContext from './HoverCardContext';
import styles from './HoverCard.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = memo(({ children }) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    const init = () => {
      const nextElement = e.relatedTarget as HTMLElement | null;
      if (!rootRef.current?.contains(nextElement)) {
        setIsOpen(false);
      }
    };
    setTimeout(() => {
      init();
    }, 200);
    
  };

  return (
    <HoverCardContext.Provider value={{
      rootRef,
      triggerRef,
      contentRef,
      isOpen,
      setIsOpen,
    }}>
      <span
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={(e: MouseEvent<HTMLElement>) => handleMouseLeave(e)}
        ref={rootRef}
        className={styles.hoverCardRoot}
      >
        {children}
      </span>
    </HoverCardContext.Provider>
  );
});
Root.displayName = 'HoverCard.Root';

export default Root;