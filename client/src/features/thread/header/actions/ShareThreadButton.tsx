import { useState } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Popover from 'src/components/popover';
import postgresDB from 'src/storage/postgresDB';

interface Props {
  threadId: string;
}

const ShareThreadButton = ({ threadId }: Props) => {
  const [sharedThreadId, setSharedThreadId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const id = await postgresDB.addPublicThread({ threadId });
    if (id) {
      setIsLoading(false);
      setSharedThreadId(id);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          onClick={handleClick}
          variant='outline'
          size='icon'
        >
          <Icons.Share />
        </Button>
      </Popover.Trigger>
      <Popover.Content align='end'>
        {isLoading
          ? <p>'Creating public thread...'</p>
          : <p>{`${import.meta.env.VITE_CLIENT_URL}/general/${sharedThreadId}?share=true`}</p>
        }
      </Popover.Content>
    </Popover.Root>
  );
};

export default ShareThreadButton;