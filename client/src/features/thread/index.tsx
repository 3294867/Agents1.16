import { LoaderIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Error from 'src/components/Error';
import hooks from 'src/hooks';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { thread, isLoading, error } = hooks.useGetThread(threadId);
  
  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!thread) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className='text-white'>
      <p>{JSON.stringify(thread)}</p>
    </div>
  );
};

export default Thread;

const Loading = () => {
  return (
    <div className='w-[640px] h-full mx-auto flex justify-center items-center'>
      <LoaderIcon className='w-5 h-5 text-white animate-spin' />
    </div>
  )
}