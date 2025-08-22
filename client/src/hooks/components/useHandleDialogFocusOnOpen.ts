import { RefObject, useEffect } from 'react';

interface Props {
  dialogRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}

const useHandleDialogFocusOnOpen = ({ dialogRef, isOpen }: Props): void => {
  useEffect(() => {
    setTimeout(() => {
      if (dialogRef.current && isOpen) {
        const focusableElement = dialogRef.current
          .querySelector('[data-focus-on-dialog-open]') as HTMLElement;
        
        if (focusableElement) {
          focusableElement.focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 200)
  }, [dialogRef, isOpen]);
};

export default useHandleDialogFocusOnOpen;