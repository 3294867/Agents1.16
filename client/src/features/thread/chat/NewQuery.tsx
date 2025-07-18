import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Paragraph } from 'src/components/Paragraph';
import { Button } from 'src/components/Button';
import { ArrowRightFromLineIcon, SquarePenIcon, Trash2Icon } from 'lucide-react';

interface NewQueryProps {
  threadId: string;
};

const NewQuery = (props: NewQueryProps) => {
  const newQuery = {
    requestId: '',
    requestBody: '',
    responseId: '',
    responseBody: ''
  }
  
  return (
    <>
      <Card threadId={props.threadId} requestBody={newQuery.requestBody} />
      <ProgressiveParagraph responseBody={newQuery.responseBody} />
    </>
  )
};

export default NewQuery;

interface CardProps {
  threadId: string;
  requestBody: string;
};

const Card = (props: CardProps) => {
  return (
    <div className='w-full min-h-[80px] flex flex-col px-4 py-2 rounded-xl bg-white/15 text-text-primary'>
      <div className='flex justify-between items-start'>
        <Paragraph variant='thick'>{props.requestBody}</Paragraph>
        <Actions />
        {/* ProgressBar */}
      </div>
    </div>
  )
};

const Actions = () => {
  return (
    <div className='flex gap-1.5'>
      <Button variant='ghost' size='sm' className='w-8 p-0 rounded-full bg-transparent border-tran'>
        <SquarePenIcon className='size-4'/> 
      </Button>
      <Button variant='ghost' size='sm' className='w-8 p-0 rounded-full bg-transparent border-white/30'>
        <Trash2Icon className='size-4'/> 
      </Button>
      <Button variant='ghost' size='sm' className='w-8 p-0 rounded-full bg-transparent border-white/30'>
        <ArrowRightFromLineIcon className='size-4'/> 
      </Button>
    </div>
  )
}


interface ProgressiveTextProps {
  responseBody: string;
};

const ProgressiveParagraph = (props: ProgressiveTextProps) => {
  const [copy, setCopy] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < props.responseBody.length) {
        setCopy(props.responseBody.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    },12);

    return () => clearInterval(timer);
  },[props.responseBody]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paragraph variant='thin'>
        {copy}
      </Paragraph>
    </motion.div>
  )
};