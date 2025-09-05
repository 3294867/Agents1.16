import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import hooks from 'src/hooks';
import utils from 'src/utils';
import Heading from 'src/components/heading';
import Dialog from 'src/components/dialog';
import Error from 'src/components/error';
import Icons from 'src/assets/icons';
import { AddAgent } from 'src/types';
import styles from './AgentThumbnails.module.css'

const AgentThumbnails = memo(() => {
  const navigate = useNavigate();
  const { workspaceId, workspaceName } = hooks.features.useAgentContext();
  const { availableAgents, error, isLoading } = hooks.features.useHandleAddAgentDialog({ workspaceId });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!availableAgents) return <Error error='Failed to fetch available agents' />
  
  const handleClick = async (i: AddAgent) => {
    await postgresDB.addAgent({ workspaceId, agentData: i });
    navigate(`/${workspaceName}/${i.name}`);
  };
  
  const thumbnails = import.meta.glob('/src/assets/thumbnails/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default'
  });
  
  return (
    <div className={styles.wrapper}>
      {availableAgents.map((i: AddAgent) => {
        const imageSrc = thumbnails[`/src/assets/thumbnails/${i.name}.jpg`] as string | undefined;
        return (
          <Dialog.CloseWindow>
            <div onClick={() => handleClick(i)} className={styles.thumbnail}>
              <img 
                src={imageSrc}
                alt={`${i.name} agent`}
                className={styles.image} 
              />
              <div className={styles.content}>
                <Heading variant='h5' className={styles.title}>
                  {utils.capitalizeFirstLetter(i.name)}
                </Heading>
              </div>
            </div>
          </Dialog.CloseWindow>
        );
      })}
    </div>
  );
});

export default AgentThumbnails;

const Loading = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.thumbnail}>
        <div className={styles.contentLoading}>
          <Icons.Loader className={styles.loadingIcon} />
        </div>
      </div>
    </div>
  );
};