import { FC } from 'react';
import { createPortal } from 'react-dom';
import hooks from 'src/hooks';
import cn from 'src/utils/cn';
import styles from './Dialog.module.css';
import utils from './utils';

interface Props {
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Overlay: FC<Props> = ({ isNestedInDropdown = false, isPermanent = false }) => {
  const { isOpen, setIsOpen } = utils.useDialogContext();
  const mounted = hooks.useMounted({ isVisible: isOpen });

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn(styles.dialogOverlay)}
      onClick={(isNestedInDropdown || isPermanent) ? undefined : () => setIsOpen(false)}
    />,
    document.body
  );
};

export default Overlay;