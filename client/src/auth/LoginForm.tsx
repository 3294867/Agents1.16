import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { useAuth } from 'src/auth/AuthContext';
import Dialog from 'src/components/Dialog';
import Heading from 'src/components/Heading';

const LoginForm = () => {
  const { login, signUp, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(name, password).then(() => navigate('/'));
      } else {
        await signUp(name, password).then(() => navigate('/'));
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, [mode, name, password, login, signUp, navigate]);

  return (
    <Dialog.Root>
      <Dialog.Content open={true}>
        <Heading variant='h5' style={{ marginBottom: '1ren'}}>{mode === 'login' ? 'Log in' : 'Sign up'}</Heading>
        <div style={{ display: 'grid', gap: 12, width: 320 }}>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" disabled={isLoading}>
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ textDecoration: 'underline' }}>
            {mode === 'login' ? 'Create account' : 'Have an account? Log in'}
          </button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LoginForm; 