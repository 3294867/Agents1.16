interface Props {
  requestId: string;
  responseId: string;
}

const responsePaused = ({ requestId, responseId }: Props) => {
  const event = new CustomEvent('responsePaused', {
    detail: { requestId, responseId }
  })
  window.dispatchEvent(event);
};

export default responsePaused;