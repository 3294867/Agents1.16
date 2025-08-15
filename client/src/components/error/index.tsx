import { Link } from 'react-router-dom';
import Button from 'src/components/button';
import Dialog from 'src/components//dialog';
import Paragraph from 'src/components//paragraph';
import Heading from 'src/components/heading';
import styles from './Error.module.css';

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