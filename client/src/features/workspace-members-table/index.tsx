import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender
} from '@tanstack/react-table';
import postgresDB from 'src/storage/postgresDB';
import utils from 'src/utils';
import Table from 'src/components/table';
import InviteMember from './inviteMember';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown';
import Icons from 'src/assets/icons';
import constants from 'src/constants';
import WorkspaceMembersTableContext from './WorkspaceMembersTableContext';

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  workspaceId: string;
  workspaceName: string;
}

const WorkspaceMembersTable = <TData, TValue>({ columns, data, workspaceId, workspaceName }: Props<TData, TValue>) => {
  const [closeDropdown, setCloseDropdown] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleUpdateMemberRole = async ({ userId, role }: { userId: string, role: string }) => {
    await postgresDB.updateMemberRole({ workspaceId, userId, role });
    setCloseDropdown(true);
    setTimeout(() => setCloseDropdown(false), 100);
  };

  const context = {
    workspaceId,
    workspaceName,
    memberNames: table.getRowModel().rows.map(row => row.original.memberName),
  }
  
  return (
    <WorkspaceMembersTableContext.Provider value={context}>
      <Table.Root>
        <Table.Actions>
          <InviteMember />
        </Table.Actions>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Header key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Head key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Head>
            ))}
          </Table.Header>
        ))}
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => {
                const buttonBackgroundColor = cell.getValue() === 'admin'
                  ? 'orange'
                  : cell.getValue() === 'editor'
                  ? 'blue'
                  : 'green';
                
                return cell.column.id === 'member_role'
                  ? (
                    <Table.Cell key={cell.id}>
                      <Dropdown.Root >
                        <Dropdown.Trigger asChild>
                          <Button style={{
                            width: '5rem',
                            backgroundColor: buttonBackgroundColor || ''
                          }}>
                            {utils.capitalizeFirstLetter(cell.getValue() as string)}
                            <Icons.ChevronDown style={{ marginLeft: '0.5rem', marginRight: '-0.5rem' }} />
                          </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Content sideOffset={8} align='end' forceClose={closeDropdown}>
                          {constants.userRoles
                            .filter(i => i !== utils.capitalizeFirstLetter(cell.getValue() as string))
                            .map(i => (
                              <Button
                                key={i}
                                onClick={() => handleUpdateMemberRole({ userId: row.original.memberId, role: i.toLowerCase() })}
                                variant='dropdown'
                                style={{ width: '4.5rem' }}
                              >
                                {utils.capitalizeFirstLetter(i)}
                              </Button>
                            ))
                          }
                        </Dropdown.Content>
                      </Dropdown.Root>
                    </Table.Cell>
                  ) : (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ); 
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </WorkspaceMembersTableContext.Provider>
  );
};
WorkspaceMembersTable.displayName = 'WorkspaceMembersTable';

export default WorkspaceMembersTable;
