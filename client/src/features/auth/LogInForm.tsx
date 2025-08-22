import { useNavigate } from 'react-router-dom';
import { Fragment, useCallback, useState } from 'react';
import hooks from 'src/hooks';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Dialog from 'src/components/dialog';
import Heading from 'src/components/heading';
import Label from 'src/components/label';
import Paragraph from 'src/components/paragraph';
import Icons from 'src/assets/icons';
import styles from './Form.module.css';

const LogInForm = () => {
  const { login, isLoading } = hooks.components.useAuthContext();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(name, password).then(() => navigate('/'));
    } catch (error) {
      setError((error as Error).message);
    }
  }, [name, password, login, navigate]);


  return (
    <Dialog.Root>
      <Dialog.Content isPermanent={true} open={true}>
        <div className={styles.header}>
          <Heading variant='h5'>
            Welcome Back
          </Heading>
          <Paragraph>
            Log in to your account to continue
          </Paragraph>
        </div>
        <div className={styles.error}>
          {error && (
            <Fragment>
              <Icons.CircleAlert />
              <Paragraph>{error}</Paragraph>
            </Fragment>
          )}
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formField}>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              placeholder="Enter your name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              autoComplete='username'
              autoFocus
            />
          </div>
          <div className={styles.formField}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete='current-password'
            />
            <button
              type='button'
              className={styles.visibilityButton}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible
                ? <Icons.EyeClosed style={{ color: 'var(--text-tertiary)' }} />
                : <Icons.EyeOpened style={{ color: 'var(--text-tertiary)' }} />
              }
            </button>
          </div>
          <div className={styles.actionsContainer}>
            <Button
              type='button'
              variant='link'
              onClick={() => navigate('/sign-up')}
            >
              Don't have an account? Sign up.
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Fragment>
                  <Icons.Loader className={styles.loader} />
                  Signing In...
                </Fragment>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LogInForm;