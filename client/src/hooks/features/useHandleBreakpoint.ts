import { useEffect, useState } from 'react';

interface Props {
  windowInnerWidth: number;
}

const useHandleBreakpoint = ({ windowInnerWidth }: Props): boolean => {
  const [ isBreakpoint, setIsBreakpoint ] = useState<boolean>(false);

  useEffect(() => {
    const callback = () => {
      if (window.innerWidth < windowInnerWidth) {
        setIsBreakpoint(true);
      } else {
        setIsBreakpoint(false);
      }
    }
    callback();
    window.addEventListener('resize', callback);

    return () => window.removeEventListener('resize', callback);
  }, [windowInnerWidth]);

  return isBreakpoint;
};

export default useHandleBreakpoint;