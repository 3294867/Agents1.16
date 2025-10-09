import { ColumnDef } from '@tanstack/react-table';
import Icons from 'src/assets/icons';
import Checkbox from 'src/components/checkbox';
import { WorkspaceMember } from 'src/types';
import styles from './Columns.module.css';

const workspaceMembersColumns: ColumnDef<WorkspaceMember>[] = [
   {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
        aria-label='Select row'
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'member_name',
    accessorKey: 'memberName',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className={styles.headerButton}
        >
          Name
          <Icons.ChevronUpDown style={{
            width: '1rem',
            height: '1rem',
            marginLeft: '0.5rem',
            opacity: '50%',
          }} />
        </button>
      );
    },
  },
  {
    id: 'member_role',
    accessorKey: 'memberRole',
    header: ({ column }) => {
      return (
        <button
          className={styles.headerButton}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <Icons.ChevronUpDown style={{
            width: '1rem',
            height: '1rem',
            marginLeft: '0.5rem',
            opacity: '50%',
          }} />
        </button>
      );
    },
  },
];

export default workspaceMembersColumns;