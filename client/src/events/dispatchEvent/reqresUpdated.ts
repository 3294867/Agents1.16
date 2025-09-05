import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  reqres: ReqRes;
}

const reqresUpdated =  ({ threadId, reqres }: Props) => {
  const event = new CustomEvent('reqresUpdated', {
    detail: { threadId, reqres }
  });
  window.dispatchEvent(event);
};

export default reqresUpdated;