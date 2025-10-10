import { memo } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Heading from 'src/components/heading';
import Popover from 'src/components/popover';
import NotificationsList from './NotificationsList';

const NotificationsPopover = memo(() => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button size='icon' variant='outline'>
          <Icons.Notifications />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        side='right'
        sideOffset={12}
        align='end'
      >
        <Heading variant='h6' style={{ padding: '0.5rem' }}>Notifications</Heading>
        <NotificationsList />
      </Popover.Content>
    </Popover.Root>
  );
});
NotificationsPopover.displayName = 'NotificationsPopover';

export default NotificationsPopover;