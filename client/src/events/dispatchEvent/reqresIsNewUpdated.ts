interface Props {
  threadId: string;
  responseId: string;
  isNew: boolean;
}

const reqresIsNewUpdated = ({ threadId, responseId, isNew }: Props) => {
  const event = new CustomEvent('reqresIsNewUpdated', {
    detail: { threadId, responseId, isNew }
  });
  window.dispatchEvent(event);
};

export default reqresIsNewUpdated;