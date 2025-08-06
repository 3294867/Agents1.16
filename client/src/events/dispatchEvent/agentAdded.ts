import { Agent } from 'src/types';

const agentAdded =  (agent: Agent) => {
  const event = new CustomEvent('agentAdded', {
    detail: { agent }
  });
  window.dispatchEvent(event);
};

export default agentAdded;