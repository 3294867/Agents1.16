import { RefObject, useEffect, useState } from 'react';

interface Props {
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLElement | null>;
  mounted: boolean;
}

const useGetSize = ({ ref, mounted }: Props): { height: number, width: number } => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!mounted || !ref.current) return;

    const el = ref.current;
    
    const updateHeight = () => setHeight(el.offsetHeight);
    const heightObserver = new ResizeObserver(updateHeight);
    heightObserver.observe(el);

    const updateWidth = () => setWidth(el.offsetWidth);
    const widthObserver = new ResizeObserver(updateWidth);
    widthObserver.observe(el);

    return () => {
      heightObserver.disconnect();
      widthObserver.disconnect();
    }
  }, [ref, mounted]);

  return {
    height,
    width
  };
};

export default useGetSize;
