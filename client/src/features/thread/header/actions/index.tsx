import { memo } from 'react';
import hooks from 'src/hooks';
import BookmarkThreadButton from './BookmarkThreadButton';
import DeleteThreadDialog from './DeleteThreadDialog';
import Dropdown from 'src/components/dropdown';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import ShareThreadButton from './ShareThreadButton';

const Actions = memo(() => {
  const { threadIsBookmarked } = hooks.features.useThreadContext();
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.375rem', justifyContent: 'end', alignItems: 'start'}}>
      <ShareThreadButton />
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.More />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content align='end' sideOffset={4}>
          {!threadIsBookmarked && <BookmarkThreadButton />}
          <DeleteThreadDialog />
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
});

export default Actions;
