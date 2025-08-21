import { useEffect, useState } from 'react';

interface Props {
  isVisible: boolean;
  delay?: number;
}

const useHandleMount = ({ isVisible, delay = 0 }: Props): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      if (delay > 0) {
        const timer = setTimeout(() => setMounted(true), delay);
        return () => clearTimeout(timer);
      } else {
        setMounted(true);
      }
    } else {
      setMounted(false);
    }
  }, [isVisible, delay]);

  return mounted;
};

export default useHandleMount; 