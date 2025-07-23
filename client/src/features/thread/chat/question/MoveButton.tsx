interface Props {
  requestId: string;
};

const MoveButton = (props: Props) => {
  return (
    <button className='cursor-pointer text-text-primary flex justify-center items-center h-8 w-8 rounded-full hover:bg-border transition-colors duration-200'>
      <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M3 5v14'/><path d='M21 12H7'/><path d='m15 18 6-6-6-6'/></svg>
    </button>
  )
};

export default MoveButton;