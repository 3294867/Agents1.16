const responsePaused = (requestId: string) => {
  const event = new CustomEvent('responsePaused', {
    detail: { requestId }
  })
  window.dispatchEvent(event);
};

export default responsePaused;