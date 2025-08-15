import { FC } from 'react';
import Button from '../button';
import useDialogContext from './useDialogContext';

const CloseButton: FC = () => {
  const { setIsOpen } = useDialogContext();

  return (
    <Button variant='ghost' onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  );
};

export default CloseButton;