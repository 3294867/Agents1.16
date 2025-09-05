import { useContext } from 'react'
import AgentContext from 'src/features/agent/AgentContext'

const useAgentContext = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgentContext must be within an Agent');
  return ctx;
}

export default useAgentContext;