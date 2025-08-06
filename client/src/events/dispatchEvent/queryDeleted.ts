const queryDeleted =  (threadId: string, requestId: string) => {
  const event = new CustomEvent('queryDeleted', {
    detail: { threadId, requestId }
  });
  window.dispatchEvent(event);
};

export default queryDeleted;