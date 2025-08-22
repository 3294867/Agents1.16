import { RefObject, useEffect, useState } from 'react';

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
}

const useGetTriggerSize = ({ triggerRef }: Props): { triggerHeight: number, triggerWidth: number } => {
  const [triggerHeight, setTriggerHeight] = useState(0);
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    const el = triggerRef.current;
    
    const updateHeight = () => setTriggerHeight(el.offsetHeight);
    const heightObserver = new ResizeObserver(updateHeight);
    heightObserver.observe(el);

    const updateWidth = () => setTriggerWidth(el.offsetWidth);
    const widthObserver = new ResizeObserver(updateWidth);
    widthObserver.observe(el);

    return () => {
      heightObserver.disconnect();
      widthObserver.disconnect();
    }
  }, [triggerRef]);

  return {
    triggerHeight,
    triggerWidth
  };
};

export default useGetTriggerSize;
