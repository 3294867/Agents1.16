import { memo } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';

interface Props {
  userId: string;
}

const AddWorkspaceDialog = memo(({ userId }: Props) => {
  return (
    <Button variant='outline' size='icon'>
      <Icons.Add />
    </Button>
  );
});

export default AddWorkspaceDialog;