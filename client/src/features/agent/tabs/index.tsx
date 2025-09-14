import { memo } from 'react';
import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Tab from './Tab';
import AddTab from './AddTab';
import Error from 'src/components/error';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

const Tabs = memo(() => {
  const { workspaceName, agentName } = hooks.features.useAgentContext();
  const { threadId: currentThreadId } = useParams();
  const { tabs, isLoading, error } = hooks.features.useHandleTabs({ workspaceName, agentName });

  if (isLoading) return <Loading />
  if (error || !currentThreadId || !tabs) return <Error error={error ?? 'Something went wrong try again later.'} />;

  return (
    <div style={{ maxWidth: '72%', display: 'flex', gap: '0.5rem' }}>
      {tabs.map(t => (
        <Tab
          key={t.id}
          tab={t}
          tabs={tabs}
          currentThreadId={currentThreadId}
        />
      ))}
      <AddTab tabs={tabs} currentThreadId={currentThreadId} />
    </div>
  );
});

export default Tabs;

const Loading = () => {
  return (
    <div style={{ maxWidth: '72%', display: 'flex', gap: '0.5rem' }}>
      <div style={{ height: '2.25rem', width: '4rem', border: '1px solid var(--border)', borderRadius: '9999px' }} />
      <Button
        variant='outline'
        size='icon'
        style={{ height: '2.25rem', width: '2.25rem' }}
      >
        <Icons.Add />
      </Button>
    </div>
  );
};