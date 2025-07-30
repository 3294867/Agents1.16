import { memo } from 'react';
import { Button } from 'src/components/Button';

interface Props {
  userId: string;
}

const Account = memo(({ userId }: Props) => {
  return (
    <Button variant='outline' size='icon'>
      <img src='/avatar.png' width={36} height={36} style={{ borderRadius: '9999px' }} />
    </Button>
  );
});

export default Account;