import { FC } from 'react';
import Dialog from './index';
import Button from 'src/components/button';
import Heading from 'src/components/heading';
import Paragraph from 'src/components/paragraph';
import Input from 'src/components/input';

const DemoDialog: FC = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      
      <Dialog.Content>
        <Heading variant="h2">Example Dialog</Heading>
        <Paragraph>
          This dialog demonstrates accessibility features including focus management and keyboard navigation.
        </Paragraph>
        
        <Input 
          placeholder="This input will be focused when dialog opens"
          data-focus-on-dialog-open
        />
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={() => {}}>
            Confirm
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DemoDialog; 