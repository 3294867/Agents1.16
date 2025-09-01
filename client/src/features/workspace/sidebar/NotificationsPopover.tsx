import { memo } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Popover from 'src/components/popover';

interface Props {
  userId: string;
}

const NotificationsPopover = memo(({ userId }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button size='icon' variant='outline'>
          <Icons.Notifications />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        {/* TODO */}
        Content
      </Popover.Content>
    </Popover.Root>
  );
});

export default NotificationsPopover;