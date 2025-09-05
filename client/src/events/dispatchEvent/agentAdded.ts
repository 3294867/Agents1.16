import { Agent } from 'src/types';

interface Props {
  agent: Agent;
}

const agentAdded = ({ agent }: Props) => {
  const event = new CustomEvent('agentAdded', {
    detail: { agent }
  });
  window.dispatchEvent(event);
};

export default agentAdded;