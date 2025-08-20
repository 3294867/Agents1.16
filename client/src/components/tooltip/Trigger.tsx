/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import useTooltipContext from './useTooltipContext';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = ({ asChild, children }) => {
  const { triggerRef, setIsOpen } = useTooltipContext();

  const props = {
    ref: triggerRef,
    onMouseEnter: () => setIsOpen(true),
    onMouseLeave: () => setIsOpen(false),
    onFocus: () => setIsOpen(true),
    onBlur: () => setIsOpen(false),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, props, children.props));
  }

  return <span {...props}>{children}</span>;
};

export default Trigger;