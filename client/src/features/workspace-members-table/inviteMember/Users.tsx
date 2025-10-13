import { ChangeEvent, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import Icons from 'src/assets/icons';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Paragraph from 'src/components/paragraph';
import styles from './Users.module.css';
import hooks from 'src/hooks';
import { toast } from 'sonner';

const Users = () => {
  const { workspaceId, workspaceName, memberNames } = hooks.features.useWorkspaceMembersTableContext();
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  const handleSearchValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (e.target.value !== '') {
      setTimeout(async () => {
        const fetchUsers = await postgresDB.getUsers({ input: e.target.value })
        if (!fetchUsers) return;
        const filteredUsers = fetchUsers.filter(user => !memberNames.includes(user))
        setUsers(filteredUsers);
      }, 200);
    }
  };

  const handleInviteUser = async (userName: string) => {
    const inviteUser = await postgresDB.inviteUser({ userName, workspaceId }); 
    if (!inviteUser) {
      toast.error(`Failed to invite user. Try again later`);
      return;
    }
    toast.success(`User invited`);
  }

  return (
    <div className={styles.wrapper}>
      <div style={{ position: 'relative' }}>
        <Icons.Search className={styles.searchIcon} />
        <Input
          className={styles.input}
          placeholder='Seach user'
          value={searchValue || ''}
          onChange={handleSearchValue}
          autoFocus
        />
      </div>
      <div className={styles.list}>
        {users.length === 0 ? (
          <div className={styles.message}>
            {searchValue === '' || !searchValue
              ? 'Enter user name'
              : 'No users found'
            }
          </div>
        ) : (
          users.map((i: string) => (
            <div key={i} className={styles.item}>
              <Paragraph>{i}</Paragraph>
              <Button
                onClick={() => handleInviteUser(i)}
                variant='ghost'
                size='sm'
                className={styles.button}
              >
                <Icons.Add className={styles.plusIcon} />
                Invite
              </Button>
            </div>
          ))
        )
      }
      </div>
    </div>
  )
};

export default Users;