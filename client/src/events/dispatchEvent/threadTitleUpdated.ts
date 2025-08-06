const threadTitleUpdated =  (threadId: string, threadTitle: string | null) => {
  const event = new CustomEvent('threadTitleUpdated', {
    detail: { threadId, threadTitle }
  });
  window.dispatchEvent(event);
};

export default threadTitleUpdated;