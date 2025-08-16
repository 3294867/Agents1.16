import { useCallback, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useHandleEscapeKey = ({ isOpen, setIsOpen }: Props ): void => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
};

export default useHandleEscapeKey;