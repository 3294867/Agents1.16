import Icons from 'src/assets/Icons';
import Button from 'src/components/Button';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  requestId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditButton = ({ requestId, setIsEditing }: Props) => {
  const handleClick = () => {
    const update = () => {
      return new Promise<void>((resolve) => {
        dispatchEvent.responsePaused(requestId);
        setIsEditing(true);
        resolve();
      });
    };
    update().then(() => dispatchEvent.editingQuestion(requestId));
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      <Icons.Edit />
    </Button>
  );
};

export default EditButton;