import { FC, ReactNode, useState, useId, useRef, memo } from 'react';
import utils from 'src/utils';
import DialogContext from './DialogContext';
import styles from './Dialog.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = memo(({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogContext.Provider value={{ 
      isOpen,
      setIsOpen,
      dialogRef,
      dialogId, 
      titleId,
      descriptionId 
    }}>
      <span className={utils.cn(styles.dialogContainer)}>
        {children}
      </span>
    </DialogContext.Provider>
  );
});

export default Root;