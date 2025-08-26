import { cloneElement, FC, isValidElement, memo, ReactElement } from 'react';
import hooks from 'src/hooks';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = memo(({ asChild, children }) => {
  const { setIsOpen } = hooks.components.useDialogContext();

  const props = {
    onClick: () => setIsOpen(true),
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, props, children.props));
  }

  return <span {...props}>{children}</span>;
});

export default Trigger;