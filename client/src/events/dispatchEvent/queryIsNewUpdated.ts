const queryIsNewUpdated = (threadId: string, responseId: string, isNew: boolean) => {
  const event = new CustomEvent('queryIsNewUpdated', {
    detail: { threadId, responseId, isNew }
  });
  window.dispatchEvent(event);
};

export default queryIsNewUpdated;