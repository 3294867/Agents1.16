import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  delay?: number;
}

interface Return {
  isMounted: boolean;
}

const useHandleMount = ({ isOpen, delay = 0 }: Props): Return => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (delay > 0) {
        const timer = setTimeout(() => setIsMounted(true), delay);
        return () => clearTimeout(timer);
      } else {
        setIsMounted(true);
      }
    } else {
      setIsMounted(false);
    }
  }, [isOpen, delay]);

  return { isMounted };
};

export default useHandleMount; 