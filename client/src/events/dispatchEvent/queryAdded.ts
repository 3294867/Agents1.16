import { ReqRes } from 'src/types';

const reqresAdded =  (threadId: string, query: ReqRes) => {
  const event = new CustomEvent('reqresAdded', {
    detail: { threadId, query }
  });
  window.dispatchEvent(event);
};

export default reqresAdded;