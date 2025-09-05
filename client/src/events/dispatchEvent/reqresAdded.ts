import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  reqres: ReqRes;
}

const reqresAdded =  ({ threadId, reqres}: Props) => {
  const event = new CustomEvent('reqresAdded', {
    detail: { threadId, reqres }
  });
  window.dispatchEvent(event);
};

export default reqresAdded;