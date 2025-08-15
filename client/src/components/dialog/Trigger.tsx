import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import useDialogContext from './useDialogContext';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = ({ asChild, children }) => {
  const { setIsOpen } = useDialogContext();

  const childProps = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps));
  }

  return <span>{children}</span>;
};

export default Trigger;