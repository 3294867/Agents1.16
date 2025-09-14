const tabsUpdated =  () => {
  const event = new CustomEvent('tabsUpdated');
  window.dispatchEvent(event);
};

export default tabsUpdated;