import { FC } from 'react';
import Button from '../button';
import hooks from 'src/hooks';

const CloseButton: FC = () => {
  const { setIsOpen } = hooks.components.useDialogContext();

  return (
    <Button style={{ width: 'fit-content' }} variant='ghost' onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  );
};

export default CloseButton;