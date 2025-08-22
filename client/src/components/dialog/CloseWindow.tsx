import { FC, ReactNode } from 'react';
import hooks from 'src/hooks';

interface Props {
  children: ReactNode;
}

const CloseWindow: FC<Props> = ({ children }) => {
  const { setIsOpen } = hooks.components.useDialogContext();

  return (
    <div onClick={() => setIsOpen(false)}>
      {children}
    </div>
  );
};

export default CloseWindow;