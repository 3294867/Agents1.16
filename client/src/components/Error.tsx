import { Button } from './Button';
import { Dialog, DialogContent, DialogTitle } from './Dialog';
import { Paragraph } from './Paragraph';


interface Props {
  error: string
};

const Error = ({ error }: Props) => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogTitle>Error</DialogTitle>
        <Paragraph variant='thin' isMuted={true} className='mt-4'>
          {error}
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