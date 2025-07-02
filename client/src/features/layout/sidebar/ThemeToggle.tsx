import { memo, useCallback, useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from 'src/components/Button';
import { useHandleTheme } from 'src/hooks/useHandleTheme';



const ThemeToggle = memo(() => {
  const { theme, setTheme } = useHandleTheme();

  const handleClick = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  },[theme, setTheme])

  const icon = useMemo(() =>
    theme === 'light'
    ? <Sun className='w-4 h-4 text-text-primary/80' />
    : <Moon className='w-4 h-4 text-text-primary/80' />,
  [theme]);

  return (
    <Button onClick={handleClick} variant='outline' size='icon' className='rounded-full'>
      {icon}
    </Button>

    
  )
});

export default ThemeToggle;