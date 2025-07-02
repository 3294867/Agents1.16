import { memo } from 'react';
import { Button } from 'src/components/Button';

interface AccountProps {
  userId: string;
}

const Account = memo((props: AccountProps) => {
  return (
    <Button variant='outline' size='icon' className='rounded-full'>
      <img src='/avatar.png' width={36} height={36} className='rounded-full'/>
    </Button>
  )
});

export default Account;