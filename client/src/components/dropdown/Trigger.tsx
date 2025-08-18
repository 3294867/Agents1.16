import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import utils from './utils';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = ({ asChild, children }: Props) => {
  const { setIsOpen } = utils.useDropdownContext();
  
  const childProps = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps))
  }
  
  return <span>{children}</span>
};

export default Trigger;