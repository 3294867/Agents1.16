import { useEffect, useState } from 'react';

export const useHandleTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.body.className = `${localStorage.getItem('theme') || theme}`;
    setTheme((localStorage.getItem('theme') || theme) as 'light' | 'dark');
    return () => {
      document.body.className = '';
    };
  }, [theme]);
  
  return { theme, setTheme };
}