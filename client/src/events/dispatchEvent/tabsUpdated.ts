const tabsUpdated =  (agentName: string) => {
  const event = new CustomEvent('tabsUpdated', {
    detail: { agentName }
  });
  window.dispatchEvent(event);
};

export default tabsUpdated;