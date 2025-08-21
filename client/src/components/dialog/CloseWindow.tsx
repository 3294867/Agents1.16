import { FC, ReactNode } from 'react';
import utils from 'src/utils';

interface Props {
  children: ReactNode;
}

const CloseWindow: FC<Props> = ({ children }) => {
  const { setIsOpen } = utils.components.useDialogContext();

  return (
    <div onClick={() => setIsOpen(false)}>
      {children}
    </div>
  );
};

export default CloseWindow;