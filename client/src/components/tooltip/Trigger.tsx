/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import useTooltipContext from './useTooltipContext';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = ({ asChild, children }) => {
  const { setIsOpen, triggerRef } = useTooltipContext();

  const childProps = {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    onMouseEnter: () => setIsOpen(true),
    onMouseLeave: () => setIsOpen(false),
    onFocus: () => setIsOpen(true),
    onBlur: () => setIsOpen(false),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps));
  }
  return <span {...childProps}>{children}</span>;
};

export default Trigger;