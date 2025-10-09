import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';

interface Props {
  rootRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const useHandleClickOutside = ({ rootRef, contentRef, setIsOpen }: Props): void => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [rootRef, contentRef]);
};

export default useHandleClickOutside;