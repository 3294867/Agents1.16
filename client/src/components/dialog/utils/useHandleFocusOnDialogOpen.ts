import { RefObject, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
}

const useHandleFocusOnDialogOpen = ({ isOpen, dialogRef }: Props): void => {
  useEffect(() => {
    setTimeout(() => {
      if (isOpen && dialogRef.current) {
        const focusableElement = dialogRef.current
          .querySelector('[data-focus-on-dialog-open]') as HTMLElement;
        
        if (focusableElement) {
          focusableElement.focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 200)
  }, [isOpen, dialogRef]);
};

export default useHandleFocusOnDialogOpen;