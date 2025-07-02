import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import selectAgents from 'src/redux/selectors/selectAgents';
import Agents from './Agents';
import ThemeToggle from 'src/features/layout/sidebar/ThemeToggle';
import Account from './Account';

interface SidebarProps {
  userId: string;
  isMobile: boolean;
}

const Sidebar = (props: SidebarProps) => {
  const { data: agents } = useSelector((state: RootState) => selectAgents(state));
  
  return !props.isMobile && (
    <aside className='fixed h-screen flex flex-col justify-between p-2 pt-4 border-r-[1px] border-border'>
      <Agents userId={props.userId} agents={agents} />
      <div className='flex flex-col gap-2'>
        <ThemeToggle />
        <Account userId={props.userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
