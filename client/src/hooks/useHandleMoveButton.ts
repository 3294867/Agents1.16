import { useEffect, useState } from 'react';

const useHandleMoveButton = () => {
  const [currentThreadPositionY, setCurrentThreadPositionY] = useState<number>(0);

  /** Set 'positionY' property of the current thread (UI) */
  useEffect(() => {
    const handleScroll = () => setCurrentThreadPositionY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return currentThreadPositionY;
};

export default useHandleMoveButton;