import { Query } from 'src/types';

const queryUpdated =  (threadId: string, query: Query) => {
  const event = new CustomEvent('queryUpdated', {
    detail: { threadId, query }
  });
  window.dispatchEvent(event);
};

export default queryUpdated;