import { FC, ReactNode, useRef, useState } from 'react';
import TooltipContext from './TooltipContext';
import styles from './Tooltip.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <span className={styles.tooltipContainer}>{children}</span>
    </TooltipContext.Provider>
  );
};

export default Root;