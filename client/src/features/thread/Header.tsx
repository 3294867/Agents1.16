import { motion } from 'framer-motion';
import { BookmarkIcon, EllipsisVerticalIcon, ShareIcon, TrashIcon } from 'lucide-react';
import { Heading } from 'src/components/Heading';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/components/DropdownMenu';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/Tooltip';
import { cn } from 'src/utils/cn';
import { Button } from 'src/components/Button';
import { Paragraph } from 'src/components/Paragraph';

interface HeaderProps {
  threadId: string;
  threadTitle: string | null;
};

const Header = ({ threadId, threadTitle }: HeaderProps) => {
  return (
    <div className={cn('flex items-start',
      threadTitle === null ? 'justify-end' : 'justify-between'
    )}>
      <Title threadTitle={threadTitle} />
      <Actions threadId={threadId} />
    </div>
  );
};

export default Header;

interface TitleProps {
  threadTitle: string | null;
};

const Title = ({ threadTitle }: TitleProps) => {
  if (!threadTitle) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Heading variant='h3' className='w-full'>
        {threadTitle}
      </Heading>
    </motion.div>
  )
};

interface ActionsProps {
  threadId: string;
};

const Actions = ({ threadId }: ActionsProps) => {
  return (
    <div className='flex gap-1.5 justify-end items-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' className='h-8 w-8 p-0 rounded-full'>
            <ShareIcon className='w-4 h-4 text-text-primary/80' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom' sideOffset={4}>
          Share
        </TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='h-8 w-8 p-0 rounded-full'>
            <EllipsisVerticalIcon className='w-4 h-4 text-text-primary/80' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem className='cursor-pointer'>
            <BookmarkIcon className='mr-2 w-4 h-4 text-text-primary/80' />
            <Paragraph variant='thin' size='sm'>
              Bookmark
            </Paragraph>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer'>
            <TrashIcon className='mr-2 w-4 h-4 text-text-primary/80' />
            <Paragraph variant='thin' size='sm'>
              Delete
            </Paragraph>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};