import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Agent, Team } from 'src/types';

interface Props {
  userId: string;
}

const useHandleRedirect = ({ userId }: Props): void => {
  const navigate = useNavigate();
  const { teamName, agentName } = useParams();

  useEffect(() => {
    if (!teamName) return;
    
    try {
      const redirect = async () => {
        let team: Team | undefined;
        team = await indexedDB.getTeamByName({ userId, teamName });
        if (!team) team = await postgresDB.getTeamByName({ userId, teamName });

        /** Redirect from  /:teamName */
        if (!agentName) {
          navigate(`/${team.name}/general`);
          return;
        }
        
        /** Redirect from  /:teamName/:agentName */
        let agent: Agent | undefined;
        agent = await indexedDB.getAgentByName({ userId, teamName, agentName });
        if (!agent) agent = await postgresDB.getAgentByName({ userId, teamName, agentName });
  
        const loadSavedTabs = tabsStorage.load(teamName, agentName);
        if (!loadSavedTabs || loadSavedTabs.length === 0) {
          const id = uuidV4();
          const addThreadPGDB = await postgresDB.addThread({
            id,
            userId,
            agentId: agent.id,
          });
          if (!addThreadPGDB) return;
          await indexedDB.addThread({ thread: addThreadPGDB }).then(() => {
            const tab = {
              id: addThreadPGDB.id,
              teamId: team.id,
              agentId: agent.id,
              title: addThreadPGDB.title,
              isActive: true
            };
            tabsStorage.addTab(teamName, agentName, tab);
            navigate(`/${teamName}/${agentName}/${id}`, { replace: true });
          });
        } else {
          navigate(`/${teamName}/${agentName}/${loadSavedTabs[0].id}`, { replace: true });
        }
      };
      redirect();
    } catch (error) {
      throw new Error(`Failed to redirect: ${error}`);
    }
  },[teamName, agentName, userId]);
};

export default useHandleRedirect;