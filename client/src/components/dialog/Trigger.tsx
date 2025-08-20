import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import utils from './utils';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = ({ asChild, children }) => {
  const { setIsOpen } = utils.useDialogContext();

  const props = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, props, children.props));
  }

  return <span {...props}>{children}</span>;
};

export default Trigger;