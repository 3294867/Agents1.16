import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from 'src/components/auth';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown';
import Icons from 'src/assets/icons';

interface Props {
  userId: string;
}

const Account = memo(({ userId }: Props) => {
  const { logout } = Auth.useContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout().then(() => navigate('/log-in'));
  }, [logout, navigate]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant='outline' size='icon'>
          <img src='/avatar.png' width={36} height={36} style={{ borderRadius: '9999px' }} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content side='right' sideOffset={48} align='start'>
        <Button data-prevent-dropdown-close onClick={handleLogout} variant='dropdown' style={{ zIndex: '2000' }}>
          <Icons.Logout style={{ marginRight: '0.5rem' }}/>
          Logout
        </Button>
      </Dropdown.Content>
    </Dropdown.Root>
  );
});

export default Account;