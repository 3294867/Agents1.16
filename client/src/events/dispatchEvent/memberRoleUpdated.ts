const memberRoleUpdated = () => {
  const event = new CustomEvent('memberRoleUpdated');
  window.dispatchEvent(event);
};

export default memberRoleUpdated;