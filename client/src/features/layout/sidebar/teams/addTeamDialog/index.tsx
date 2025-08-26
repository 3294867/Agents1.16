import { memo } from 'react';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';

interface Props {
  userId: string;
  addedTeams: Team[];
}

{/* TODO */}
const AddTeamDialog = memo(({ userId, addedTeams }: Props) => {
  return (
    <Button variant='outline' size='icon'>
      <Icons.Add />
    </Button>
  );
});

export default AddTeamDialog;