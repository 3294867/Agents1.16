import { memo } from 'react';
import Actions from './actions';
import Name from './Name';
import hooks from 'src/hooks';

const Header = memo(() => {
  const { threadName } = hooks.features.useThreadContext();
  return (
    <div style={{ display: 'flex', alignItems: 'start', justifyContent: threadName === null ? 'end' : 'space-between' }}>
      <Name />
      <Actions />
    </div>
  );
});

export default Header;