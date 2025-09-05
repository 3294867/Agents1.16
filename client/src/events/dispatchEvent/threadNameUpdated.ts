interface Props {
  threadId: string;
  threadName: string | null;
}

const threadNameUpdated =  ({ threadId, threadName }: Props) => {
  const event = new CustomEvent('threadNameUpdated', {
    detail: { threadId, threadName }
  });
  window.dispatchEvent(event);
};

export default threadNameUpdated;