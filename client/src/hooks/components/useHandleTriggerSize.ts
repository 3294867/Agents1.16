import { RefObject, useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
}

const useHandleTriggerSize = ({ triggerRef }: Props): { triggerHeight: number, triggerWidth: number } => {
  const [triggerHeight, setTriggerHeight] = useState(0);
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    const el = triggerRef.current;
    const updateSizes = debounce(() => {
      setTriggerHeight(el.offsetHeight);
      setTriggerWidth(el.offsetWidth);
    }, 100);

    const observer = new ResizeObserver(updateSizes);
    observer.observe(el);
    
    return () => observer.disconnect();
  }, [triggerRef]);

  return {
    triggerHeight,
    triggerWidth
  };
};

export default useHandleTriggerSize;
