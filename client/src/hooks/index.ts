import useGetAgents from 'src/hooks/data/useGetAgents';
import useGetAgent from './data/useGetAgent';
import useGetThread from 'src/hooks/data/useGetThread';
import useGetTabs from './data/useGetTabs';
import useHandleBreakpoint from 'src/hooks/useHandleBreakpoint';
import useHandleLayout from 'src/hooks/useHandleLayout';
import useHandleTheme from 'src/hooks/useHandleTheme';

const hooks = {
  useGetAgents,
  useGetAgent,
  useGetThread,
  useGetTabs,
  useHandleBreakpoint,
  useHandleLayout,
  useHandleTheme
};

export default hooks;