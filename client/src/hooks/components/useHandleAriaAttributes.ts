import { RefObject, useEffect } from 'react';

interface Props {
  mounted: boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  descriptionId: string;
}

const useHandleDialogAriaAttributes = ({ mounted, dialogRef, titleId, descriptionId }: Props): void => {
  useEffect(() => {
    if (mounted && dialogRef.current) {
      const heading = dialogRef.current.querySelector('h1, h2, h3, h4, h5, h6');
      const paragraph = dialogRef.current.querySelector('p');
      
      if (heading && !heading.id) {
        heading.id = titleId;
      }
      if (paragraph && !paragraph.id) {
        paragraph.id = descriptionId;
      }
    }
  }, [mounted, dialogRef, titleId, descriptionId]);
};

export default useHandleDialogAriaAttributes;
