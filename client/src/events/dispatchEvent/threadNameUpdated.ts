interface Props {
  threadName: string | null;
}

const threadNameUpdated = ({ threadName }: Props) => {
  const event = new CustomEvent('threadNameUpdated', {
    detail: { threadName }
  });
  window.dispatchEvent(event);
};

export default threadNameUpdated;