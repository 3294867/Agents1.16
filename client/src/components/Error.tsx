import { Link } from 'react-router-dom';
import Button from './Button';
import Dialog from './Dialog';
import Paragraph from './Paragraph';
import styles from './Error.module.css';
import Heading from './Heading';

interface Props {
  error: string
}

const Error = ({ error }: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Content open={true}>
        <div className={styles.container}>
          <Heading variant='h4'>Error</Heading>
          <Paragraph variant='thin' isMuted={true} className={styles.paragraph}>
            {error}
          </Paragraph>
          <div className={styles.actions}>
            <Link prefetch='intent' to='/'>
              <Button>
                Reload
              </Button>
            </Link>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Error;