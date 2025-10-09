import { FC } from 'react';
import { createPortal } from 'react-dom';
import hooks from 'src/hooks';
import utils from 'src/utils';
import styles from './Dialog.module.css';

interface Props {
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Overlay: FC<Props> = ({ isNestedInDropdown = false, isPermanent = false }) => {
  const { isOpen, setIsOpen } = hooks.components.useDialogContext();
  const isMounted = hooks.components.useHandleMount({ isOpen });

  if (!isMounted) return null;

  return createPortal(
    <div
      className={utils.cn(styles.dialogOverlay)}
      onClick={(isNestedInDropdown || isPermanent) ? undefined : () => setIsOpen(false)}
    />,
    document.body
  );
};

export default Overlay;