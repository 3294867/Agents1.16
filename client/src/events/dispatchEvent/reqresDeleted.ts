interface Props {
  threadId: string;
  requestId: string;
}

const reqresDeleted =  ({ threadId, requestId }: Props) => {
  const event = new CustomEvent('reqresDeleted', {
    detail: { threadId, requestId }
  });
  window.dispatchEvent(event);
};

export default reqresDeleted;