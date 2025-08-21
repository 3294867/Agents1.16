import { RefObject, useEffect } from 'react';

interface Props {
  dropdownRef: RefObject<HTMLDivElement | null>
  isOpen: boolean;
}

const useHandleDropdownFocusOnOpen = ({ dropdownRef, isOpen }: Props): void => {
  useEffect(() => {
    setTimeout(() => {
      if (dropdownRef.current && isOpen) {
        const focusableElement = dropdownRef.current
          .querySelector('button[id^="bookmark_thread_button"], button[id^="delete_thread_button"]') as HTMLButtonElement | null;
        if (focusableElement) {
          focusableElement.focus();
        } else {
          dropdownRef.current.focus();
        }
          
      }
    }, 200);
  },[dropdownRef, isOpen]);
};

export default useHandleDropdownFocusOnOpen;