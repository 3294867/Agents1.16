import { cloneElement, FC, isValidElement, memo, ReactElement } from 'react';
import hooks from 'src/hooks';

interface Props {
  asChild?: boolean;
  children: ReactElement;
}

const Trigger: FC<Props> = memo(({ asChild, children }) => {
  const { triggerRef } = hooks.components.useHoverCardContext();

  const props = {
    ref: triggerRef,
    'aria-describedby': undefined as string | undefined,
    tabIndex: 0,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, Object.assign({}, props, children.props));
  }

  return (
    <span {...props}>
      {children}
    </span>
  )
});
Trigger.displayName = 'HoverCard.Trigger';

export default Trigger;