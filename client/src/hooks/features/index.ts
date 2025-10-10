import useHandleWorkspace from './useHandleWorkspace';
import useHandleAgentLayout from './useHandleAgentLayout';
import useHandleAgent from './useHandleAgent';
import useHandleAddAgentDialog from './useHandleAddAgentDialog';
import useHandleAnimatedParagraph from './useHandleAnimatedParagraph';
import useHandleBreakpoint from './useHandleBreakpoint';
import useHandleQuestion from './useHandleQuestion';
import useHandleSideNav from './useHandleSideNav';
import useHandleTabs from './useHandleTabs';
import useHandleTheme from './useHandleTheme';
import useHandleThread from './useHandleThread';
import useHandleThreadPostionY from './useHandleThreadPostionY';
import useHandleAgentsDropdown from './useHandleAgentsDropdown';
import useWorkspaceContext from './useWorkspaceContext';
import useAgentContext from './useAgentContext';
import useThreadContext from './useThreadContext';
import useChatContext from './useChatContext';
import useHandleWorkspaceMembersData from './useHandleMembersTable';
import useWorkspaceMembersTableContext from './useWorkspaceMembersTableContext';
import useHandleNotifications from './useHandleNotifications';

const features = {
  useWorkspaceContext,
  useHandleWorkspace,
  useAgentContext,
  useHandleAgent,
  useHandleAddAgentDialog,
  useThreadContext,
  useHandleThread,
  useChatContext,
  useHandleTabs,
  useHandleBreakpoint,
  useHandleAgentLayout,
  useHandleTheme,
  useHandleSideNav,
  useHandleAnimatedParagraph,
  useHandleQuestion,
  useHandleThreadPostionY,
  useHandleAgentsDropdown,
  useHandleWorkspaceMembersData,
  useWorkspaceMembersTableContext,
  useHandleNotifications,
};

export default features;