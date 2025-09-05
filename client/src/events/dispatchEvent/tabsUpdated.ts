interface Props {
  agentName: string;
}

const tabsUpdated =  ({ agentName }: Props) => {
  const event = new CustomEvent('tabsUpdated', {
    detail: { agentName }
  });
  window.dispatchEvent(event);
};

export default tabsUpdated;