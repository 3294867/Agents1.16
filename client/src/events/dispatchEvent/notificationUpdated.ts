const notificationUpdated = () => {
  const event = new CustomEvent('notificationUpdated');
  window.dispatchEvent(event);
};

export default notificationUpdated;

