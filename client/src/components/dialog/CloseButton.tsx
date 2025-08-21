import { FC } from 'react';
import Button from '../button';
import utils from 'src/utils';

const CloseButton: FC = () => {
  const { setIsOpen } = utils.components.useDialogContext();

  return (
    <Button variant='ghost' onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  );
};

export default CloseButton;