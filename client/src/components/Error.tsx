import { Button } from './Button';
import { Dialog, DialogContent, DialogTitle } from './Dialog';
import { Paragraph } from './Paragraph';


interface ErrorProps {
  error: string
};

const Error = (props: ErrorProps) => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogTitle>Error</DialogTitle>
        <Paragraph variant='thin' isMuted={true} className='mt-4'>
          {props.error}
        </Paragraph>
        <div className='w-full flex justify-end'>
          <a href='/'>
            <Button>
              Reload
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default Error;