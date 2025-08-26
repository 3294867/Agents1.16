import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from 'src/components/button';
import Tooltip from 'src/components/tooltip';
import AddTeamDialog from './addTeamDialog';
import { Team } from 'src/types';
import styles from './Teams.module.css';

interface Props {
  userId: string;
  teams: Team[];
}

const Teams = memo(({ userId, teams }: Props) => {
  const { teamName } = useParams();
  
  return (
    <div className={styles.teamsContainer}>
      {teams.map(t => (
        <Tooltip.Root key={t.name}>
          <Tooltip.Trigger asChild>
            <Link prefetch='intent' to={`/${t.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${teamName === t.name ?  styles.teamButton: ''}`}
                >
                {t.name[0].toUpperCase()}
              </Button>
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Content side='right' sideOffset={12}>
            {t.name}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
      <AddTeamDialog userId={userId} addedTeams={teams} />
    </div>
  );
});

export default Teams;