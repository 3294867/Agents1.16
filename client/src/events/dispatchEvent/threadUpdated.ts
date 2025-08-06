import { Thread } from 'src/types';

const threadUpdated = (threadId: string, thread: Thread) => {
  const event = new CustomEvent('threadUpdated', {
    detail: { threadId, thread }
  });
  window.dispatchEvent(event);
};

export default threadUpdated;