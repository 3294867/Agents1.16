import { FC, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';
import useDialogContext from './useDialogContext';
import Icons from 'src/assets/icons';
import cn from 'src/utils/cn';
import styles from './Dialog.module.css'

interface Props {
  children: ReactNode;
  open?: boolean;
  className?: string;
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Content: FC<Props> = ({ children, open, className, isNestedInDropdown, isPermanent = false }) => {
  const { isOpen, setIsOpen } = useDialogContext();

  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  },[open]);

  const content = isOpen ? (
    <>
      <Overlay isNestedInDropdown={isNestedInDropdown} isPermanent={isPermanent} />
      <div className={cn(styles.dialogContent, className)}>
        {!isPermanent && (
          <button
            onClick={() => setIsOpen(false)}
            className={styles.dialogClose}
          >
            <Icons.Close />
          </button>
        )}
        {children}
      </div>
    </>
  ) : null;
  
  return createPortal(content, document.body);
};

export default Content;