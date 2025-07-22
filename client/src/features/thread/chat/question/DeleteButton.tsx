interface Props {
  requestId: string;
};

const DeleteButton = (props: Props) => {
  return (
    <button className='cursor-pointer text-text-primary/80 flex justify-center items-center h-8 w-8 rounded-full hover:bg-border transition-colors duration-200'>
      <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'><path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg>
    </button>
  )
};

export default DeleteButton;