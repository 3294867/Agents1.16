import { RefObject, useEffect } from 'react';

interface Props {
  isMounted: boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  descriptionId: string;
}

const useHandleDialogAriaAttributes = ({ isMounted, dialogRef, titleId, descriptionId }: Props): void => {
  useEffect(() => {
    if (isMounted && dialogRef.current) {
      const heading = dialogRef.current.querySelector('h1, h2, h3, h4, h5, h6');
      const paragraph = dialogRef.current.querySelector('p');
      
      if (heading && !heading.id) {
        heading.id = titleId;
      }
      if (paragraph && !paragraph.id) {
        paragraph.id = descriptionId;
      }
    }
  }, [isMounted, dialogRef, titleId, descriptionId]);
};

export default useHandleDialogAriaAttributes;
