import { memo, useCallback } from 'react';
import { Button } from 'src/components/Button';
import Icons from 'src/assets/Icons';
import useHandleTheme from 'src/hooks/useHandleTheme';

const ThemeToggle = memo(() => {
  const { theme, setTheme } = useHandleTheme();

  const handleClick = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  },[theme, setTheme]);

  return (
    <Button onClick={handleClick} variant='outline' size='icon' >
      {theme === 'light' ? <Icons.LightMode /> : <Icons.DarkMode />}
    </Button>
  );
});

export default ThemeToggle;