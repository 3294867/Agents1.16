import { FC, memo, ReactNode, useRef, useState } from 'react';
import TooltipContext from './TooltipContext';
import styles from './Tooltip.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = memo(({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <TooltipContext.Provider value={{ triggerRef, contentRef, isOpen, setIsOpen}}>
      <span className={styles.tooltipContainer}>{children}</span>
    </TooltipContext.Provider>
  );
});

export default Root;