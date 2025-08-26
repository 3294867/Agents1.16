import { useEffect, useState } from 'react';

const useHandleThreadPostionY = () => {
  const [currentThreadPositionY, setCurrentThreadPositionY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setCurrentThreadPositionY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return currentThreadPositionY;
};

export default useHandleThreadPostionY;