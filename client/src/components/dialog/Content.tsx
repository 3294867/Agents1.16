import { FC, Fragment, memo, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import hooks from 'src/hooks';
import utils from 'src/utils';
import Overlay from './Overlay';
import Icons from 'src/assets/icons';
import styles from './Dialog.module.css'

interface Props {
  children: ReactNode;
  open?: boolean;
  className?: string;
  isNestedInDropdown?: boolean;
  isPermanent?: boolean;
}

const Content: FC<Props> = memo(({ children, open, className, isNestedInDropdown, isPermanent = false }) => {
  const { isOpen, setIsOpen, dialogRef, dialogId, titleId, descriptionId }
    = hooks.components.useDialogContext();
  const { isMounted } = hooks.components.useHandleMount({ isOpen });
  hooks.components.useHandleEscapeKey({ isOpen, setIsOpen });
  hooks.components.useHandleDialogOpenProp({ open });
  hooks.components.useHandleDialogFocusOnOpen({ dialogRef, isOpen });
  hooks.components.useHandleDialogAriaAttributes({ isMounted, dialogRef, titleId, descriptionId });

  if (!isMounted) return null;

  return createPortal(
    <Fragment>
      <Overlay isNestedInDropdown={isNestedInDropdown} isPermanent={isPermanent} />
      <div 
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
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
            aria-label='Close dialog'
          >
            <Icons.Close />
          </button>
        )}
        {children}
      </div>
    </Fragment>,
    document.body
  );
});

export default Content;