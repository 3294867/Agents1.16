import { ColumnDef } from '@tanstack/react-table';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Checkbox from 'src/components/checkbox';
import { WorkspaceMember } from 'src/types';

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
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'member name',
    accessorKey: 'memberName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='hover:bg-transparent p-0'
        >
          Name
          <Icons.ChevronDown style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem'}} />
        </Button>
      );
    },
  },
  {
    id: 'member role',
    accessorKey: 'memberRole',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='hover:bg-transparent p-0'
        >
          Role
          <Icons.ChevronDown style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem'}} />
        </Button>
      );
    },
  },
];

export default workspaceMembersColumns;