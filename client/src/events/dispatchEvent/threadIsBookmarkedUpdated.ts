const threadIsBookmarkedUpdated = (threadId: string, isBookmarked: boolean) => {
  const event = new CustomEvent('threadIsBookmarkedUpdated', {
    detail: { threadId, isBookmarked }
  });
  window.dispatchEvent(event);
};

export default threadIsBookmarkedUpdated;