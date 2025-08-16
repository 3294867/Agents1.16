import { FC, ReactNode } from 'react';
import utils from './utils';

interface Props {
  children: ReactNode;
}

const CloseWindow: FC<Props> = ({ children }) => {
  const { setIsOpen } = utils.useDialogContext();

  return (
    <div onClick={() => setIsOpen(false)}>
      {children}
    </div>
  );
};

export default CloseWindow;