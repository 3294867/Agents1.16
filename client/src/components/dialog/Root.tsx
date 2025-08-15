import { FC, ReactNode, useState } from 'react';
import DialogContext from './DialogContext';
import cn from 'src/utils/cn';
import styles from './Dialog.module.css';

interface Props {
  children: ReactNode;
}

const Root: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      <span className={cn(styles.dialogContainer)}>
        {children}
      </span>
    </DialogContext.Provider>
  );
};

export default Root;