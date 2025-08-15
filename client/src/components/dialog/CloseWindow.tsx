import { FC, ReactNode } from 'react';
import useDialogContext from './useDialogContext';

interface Props {
  children: ReactNode;
}

const CloseWindow: FC<Props> = ({ children }) => {
  const { setIsOpen } = useDialogContext();

  return (
    <div onClick={() => setIsOpen(false)}>
      {children}
    </div>
  );
};

export default CloseWindow;