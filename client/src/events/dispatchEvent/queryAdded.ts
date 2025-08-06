import { Query } from 'src/types';

const queryAdded =  (threadId: string, query: Query) => {
  const event = new CustomEvent('queryAdded', {
    detail: { threadId, query }
  });
  window.dispatchEvent(event);
};

export default queryAdded;