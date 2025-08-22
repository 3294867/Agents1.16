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

const SignUpForm = () => {
  const { signUp, isLoading } = hooks.components.useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (password !== confirmPassword) {
        setError(`Passwords don't match`)
        return;
      }
      await signUp(name, password, apiKey).then(() =>
        {
          localStorage.clear();
          navigate('/')
        }
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }, [name, password, confirmPassword, apiKey, signUp, navigate]);

  return (
    <Dialog.Root>
      <Dialog.Content isPermanent={true} open={true}>
        <div className={styles.header}>
          <Heading variant='h5'>
            Create Account
          </Heading>
          <Paragraph>
            Fill out form to continue
          </Paragraph>
        </div>
        <div className={styles.error}>
          {error && (
            <Fragment>
              <Icons.CircleAlert />
              <Paragraph style={{ margin: 0 }}>{error}</Paragraph>
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
              autoComplete='name'
              autoFocus
            />
          </div>
          <div className={styles.formField}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete='new-password'
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
          <div className={styles.formField}>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete='new-password'
            />
            <button
              type='button'
              className={styles.visibilityButton}
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              aria-label={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isConfirmPasswordVisible
                ? <Icons.EyeClosed style={{ color: 'var(--text-tertiary)' }} />
                : <Icons.EyeOpened style={{ color: 'var(--text-tertiary)' }} />
              }
            </button>
          </div>
          <div className={styles.formField}>
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type={isApiKeyVisible ? 'text' : 'password'}
              placeholder="Enter API key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <button
              type='button'
              className={styles.visibilityButton}
              onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
              aria-label={isApiKeyVisible ? 'Hide password' : 'Show password'}
            >
              {isApiKeyVisible
                ? <Icons.EyeClosed style={{ color: 'var(--text-tertiary)' }} />
                : <Icons.EyeOpened style={{ color: 'var(--text-tertiary)' }} />
              }
            </button>
          </div>
          <div className={styles.actionsContainer}>
            <Button
              type='button'
              variant='link'
              onClick={() => navigate('/log-in')}
            >
              Already have an account? Log in
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !name.trim() || !password.trim()}
            >
              {isLoading ? (
                <>
                  <Icons.Loader className={styles.loader} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SignUpForm;