const progressBarLengthUpdated = (length: string) => {
  const event = new CustomEvent('progressBarLengthUpdated', {
    detail: { length }
  });
  window.dispatchEvent(event);
};

export default progressBarLengthUpdated;