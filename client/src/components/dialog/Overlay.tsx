import { FC } from 'react';
import { createPortal } from 'react-dom';
import hooks from 'src/hooks';
import styles from './Dialog.module.css';
import utils from 'src/utils';

interface Props {
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Overlay: FC<Props> = ({ isNestedInDropdown = false, isPermanent = false }) => {
  const { isOpen, setIsOpen } = utils.components.useDialogContext();
  const mounted = hooks.components.useHandleMount({ isVisible: isOpen });

  if (!mounted) return null;

  return createPortal(
    <div
      className={utils.cn(styles.dialogOverlay)}
      onClick={(isNestedInDropdown || isPermanent) ? undefined : () => setIsOpen(false)}
    />,
    document.body
  );
};

export default Overlay;