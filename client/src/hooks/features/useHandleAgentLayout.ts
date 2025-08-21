import { useEffect, useState } from 'react';

/** Handles agent layout (UI) */
const useHandleAgentLayout = () => {
  const [layout, setLayout] = useState<'oneColumn' | 'twoColumns'>('twoColumns');

  useEffect(() => {
    setLayout(localStorage.getItem('layout') as 'oneColumn' | 'twoColumns');
  }, [layout]);
  
  return { layout, setLayout };
};

export default useHandleAgentLayout;