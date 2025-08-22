import { RefObject, useCallback, useEffect } from 'react';

interface Props {
  dropdownRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}

const useHandleDropdownTabKey = ({ dropdownRef, isOpen }: Props): void => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen || !dropdownRef.current || event.key !== 'Tab') return;

    const focusableElements = Array.from(
      dropdownRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

    if (focusableElements.length === 0) return;

    const activeElement = document.activeElement as HTMLElement | null;

    if (!activeElement) return;
    
    const currentIndex = focusableElements.indexOf(activeElement);

    event.preventDefault();

    const nextIndex = event.shiftKey
      ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
      : (currentIndex + 1) % focusableElements.length;

    focusableElements[nextIndex].focus();
  },[dropdownRef, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isOpen]);
};

export default useHandleDropdownTabKey;
