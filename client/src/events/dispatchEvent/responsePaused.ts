const responsePaused = (requestId: string, responseId: string) => {
  const event = new CustomEvent('responsePaused', {
    detail: { requestId, responseId }
  })
  window.dispatchEvent(event);
};

export default responsePaused;