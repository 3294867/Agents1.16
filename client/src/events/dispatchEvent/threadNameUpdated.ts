const threadNameUpdated =  (threadId: string, threadTitle: string | null) => {
  const event = new CustomEvent('threadNameUpdated', {
    detail: { threadId, threadTitle }
  });
  window.dispatchEvent(event);
};

export default threadNameUpdated;