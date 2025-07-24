import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  requestId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditButton = ({ requestId, setIsEditing, setIsDisabled }: Props) => {
  const handleEdit = () => {
    const update = () => {
      return new Promise<void>((resolve) => {
        dispatchEvent.responsePaused(requestId);
        setIsDisabled(false);
        setIsEditing(true);
        resolve();
      });
    };
    update().then(() => dispatchEvent.editingQuestion(requestId));
  };
  
  return (
    <button onClick={handleEdit} className='h-8 w-8 text-text-button flex justify-center items-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-border'>
      <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M13 21h8'/><path d='m15 5 4 4'/><path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/></svg>
    </button>
  )
};

export default EditButton;