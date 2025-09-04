import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';

interface Props {
  userId: string;
}

const Layout = ({ userId }: Props) => {
  const outletContext = { userId };
  
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