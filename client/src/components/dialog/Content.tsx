import { FC, Fragment, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';
import Icons from 'src/assets/icons';
import hooks from 'src/hooks';
import utils from 'src/utils';
import styles from './Dialog.module.css'

interface Props {
  children: ReactNode;
  open?: boolean;
  className?: string;
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Content: FC<Props> = ({ children, open, className, isNestedInDropdown, isPermanent = false }) => {
  const { isOpen, setIsOpen, dialogRef, dialogId, titleId, descriptionId }
    = utils.components.useDialogContext();
  const mounted = hooks.components.useHandleMount({ isVisible: isOpen });
  hooks.components.useHandleEscapeKey({ isOpen, setIsOpen });
  utils.components.useHandleDialogOpenProp({ open });
  utils.components.useHandleDialogFocusOnOpen({ dialogRef, isOpen });
  utils.components.useHandleDialogAriaAttributes({ mounted, dialogRef, titleId, descriptionId });

  if (!mounted) return null;

  return createPortal(
    <Fragment>
      <Overlay isNestedInDropdown={isNestedInDropdown} isPermanent={isPermanent} />
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        id={dialogId}
        tabIndex={-1}
        className={utils.cn(styles.dialogContent, className)}
      >
        {!isPermanent && (
          <button
            onClick={() => setIsOpen(false)}
            className={styles.dialogClose}
            aria-label="Close dialog"
          >
            <Icons.Close />
          </button>
        )}
        {children}
      </div>
    </Fragment>,
    document.body
  );
};

export default Content;