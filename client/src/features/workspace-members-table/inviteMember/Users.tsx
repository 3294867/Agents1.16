import { ChangeEvent, useState } from 'react';
import Icons from 'src/assets/icons';
import styles from './Users.module.css';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Paragraph from 'src/components/paragraph';
import postgresDB from 'src/storage/postgresDB';

interface Props {
  workspaceId: string;
}

const Users = ({ workspaceId }: Props) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  const handleSearchValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    setTimeout(async () => {
      const fetchUsers = await postgresDB.getUsers({ input: e.target.value })
      if (!fetchUsers) return;
      setUsers(fetchUsers);
    }, 200);
  };

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
          <div>No users found</div>
        ) : (
          users.map((i: string) => (
            <div key={i} className={styles.item}>
              <Paragraph>{i}</Paragraph>
              <Button variant='ghost' size='sm' className={styles.button}>
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