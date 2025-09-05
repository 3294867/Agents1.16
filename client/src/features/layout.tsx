import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';
import hooks from 'src/hooks';

interface Props {
  userId: string;
}

const Layout = ({ userId }: Props) => {
  const isMobile = hooks.features.useHandleBreakpoint({ windowInnerWidth: 480 });
  const outletContext = { userId, isMobile };
  
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Outlet context={outletContext} />
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            color: 'white',
            border: '1px solid var(--border)',
            outline: 'none',
            background: 'black',
          },
        }}
      />
    </div>
  );
};

export default Layout;