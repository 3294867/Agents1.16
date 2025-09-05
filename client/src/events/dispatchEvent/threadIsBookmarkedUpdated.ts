interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const threadIsBookmarkedUpdated = ({ threadId, isBookmarked}: Props) => {
  const event = new CustomEvent('threadIsBookmarkedUpdated', {
    detail: { threadId, isBookmarked }
  });
  window.dispatchEvent(event);
};

export default threadIsBookmarkedUpdated;