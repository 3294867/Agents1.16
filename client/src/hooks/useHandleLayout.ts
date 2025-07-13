import { useEffect, useState } from 'react';

const useHandleLayout = () => {
  const [layout, setLayout] = useState<'oneColumn' | 'twoColumns'>('twoColumns');

  useEffect(() => {
    setLayout(localStorage.getItem('layout') as 'oneColumn' | 'twoColumns');
  }, [layout]);
  
  return { layout, setLayout };
};

export default useHandleLayout;