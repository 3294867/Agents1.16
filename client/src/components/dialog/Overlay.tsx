import { FC } from 'react';
import { createPortal } from 'react-dom';
import useDialogContext from './useDialogContext';
import cn from 'src/utils/cn';
import styles from './Dialog.module.css';

interface Props {
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Overlay: FC<Props> = ({ isNestedInDropdown = false, isPermanent = false }) => {
  const { setIsOpen } = useDialogContext();

  const overlay = (
    <div
      className={cn(styles.dialogOverlay)}
      onClick={(isNestedInDropdown || isPermanent) ? undefined : () => setIsOpen(false)}
    />
  );
  
  return createPortal(overlay, document.body);
};

export default Overlay;