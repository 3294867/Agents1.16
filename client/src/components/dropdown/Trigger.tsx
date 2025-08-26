import { cloneElement, FC, isValidElement, memo, ReactElement } from 'react';
import hooks from 'src/hooks';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = memo(({ asChild, children }: Props) => {
  const { setIsOpen } = hooks.components.useDropdownContext();
  
  const childProps = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, children.props, childProps))
  }
  
  return <span>{children}</span>
});

export default Trigger;