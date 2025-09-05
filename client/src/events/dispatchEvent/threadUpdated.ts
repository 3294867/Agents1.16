import { Thread } from 'src/types';

interface Props {
  threadId: string;
  thread: Thread;
}

const threadUpdated = ({ threadId, thread }: Props) => {
  const event = new CustomEvent('threadUpdated', {
    detail: { threadId, thread }
  });
  window.dispatchEvent(event);
};

export default threadUpdated;