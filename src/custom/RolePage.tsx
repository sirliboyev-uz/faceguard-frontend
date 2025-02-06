import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
  Paper,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// Import custom role table components and utilities
import { RoleTableToolbar } from 'src/custom/roleUtils/role-table-toolbar';
import { RoleTableHead } from 'src/custom/roleUtils/role-table-head';
import { RoleTableRow } from 'src/custom/roleUtils/role-table-row'; // Updated to include onEdit prop
import { TableEmptyRows } from 'src/custom/roleUtils/table-empty-rows';
import { TableNoData } from 'src/custom/roleUtils/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/custom/roleUtils/utils';

type RoleProps = {
  id: number;
  roleName: string;
  permissions: string[];
};

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('roleName');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: number[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((id: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((value) => value !== id)
        : [...prevSelected, id]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

export function RolePage() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [roles, setRoles] = useState<RoleProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the inline form (used for both creation and editing)
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleProps | null>(null);
  const [roleNameInput, setRoleNameInput] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Define the available permissions (using the enum values expected by your backend)
  const permissionsList = [
    'CREATE_COMPANY',
    'UPDATE_COMPANY',
    'READ_COMPANY',
    'DELETE_COMPANY',
    'CREATE_BRANCH',
    'UPDATE_BRANCH',
    'READ_BRANCH',
    'DELETE_BRANCH',
    'CREATE_USER',
    'UPDATE_USER',
    'READ_USER',
    'DELETE_USER',
    // Add more permissions as required
  ];

  // Function to fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
      const response = await axios.get('http://localhost:8080/api/v1/role/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedRoles = response.data.map((role: any) => ({
        id: role.id,
        roleName: role.roleName,
        permissions: role.permissions,
      }));
      setRoles(formattedRoles);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to fetch roles data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const dataFiltered = applyFilter({
    inputData: roles,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
    );
  };

  const resetForm = () => {
    setRoleNameInput('');
    setSelectedPermissions([]);
    setEditingRole(null);
    setFormError('');
  };

  // Handle form submission for both creating and updating a role
  const handleFormSubmit = async () => {
    if (!roleNameInput.trim()) {
      setFormError('Role name is required.');
      return;
    }
    setFormError('');
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('No authentication token found.');
        setFormLoading(false);
        return;
      }
      // Ensure the payload keys match what the backend expects:
      // { name: string, permissionList: string[] }
      const payload = {
        name: roleNameInput,
        permissionList: selectedPermissions,
      };

      if (editingRole) {
        // Update the role
        await axios.put(`http://localhost:8080/api/v1/role/update/${editingRole.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create a new role
        await axios.post('http://localhost:8080/api/v1/role/register', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Refresh the roles list
      await fetchRoles();
      // Hide and reset the form
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormError(editingRole ? 'Failed to update role.' : 'Failed to create role.');
    } finally {
      setFormLoading(false);
    }
  };

  // Callback when the edit button is clicked in a row.
  // This sets the form to edit mode with the role's data.
  const handleEditRole = (role: RoleProps) => {
    setEditingRole(role);
    setRoleNameInput(role.roleName);
    setSelectedPermissions(role.permissions);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Header and Form Toggle */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4" flexGrow={1}>
            Roles
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              // If the form is open (whether for editing or creating), cancel it.
              // Otherwise, open the form for creation.
              if (showForm) {
                handleCancelForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Cancel' : 'New Role'}
          </Button>
        </Box>

        {/* Inline Creation / Editing Form */}
        {showForm && (
          <Paper sx={{ padding: 3, maxWidth: 500 }}>
            <Typography variant="h5" gutterBottom>
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </Typography>
            {formError && (
              <Typography variant="body1" color="error" gutterBottom>
                {formError}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Role Name"
                value={roleNameInput}
                onChange={(e) => setRoleNameInput(e.target.value)}
                fullWidth
              />
              <Typography variant="h6">Permissions</Typography>
              <FormGroup>
                {permissionsList.map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                      />
                    }
                    label={permission}
                  />
                ))}
              </FormGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
                disabled={formLoading}
              >
                {formLoading
                  ? editingRole
                    ? 'Updating...'
                    : 'Creating...'
                  : editingRole
                  ? 'Update Role'
                  : 'Create Role'}
              </Button>
            </Box>
          </Paper>
        )}

        {/* Role List */}
        <Card>
          <RoleTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <RoleTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={roles.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, roles.map((role) => role.id))
                  }
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <RoleTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDelete={(id) => setRoles((prev) => prev.filter((r) => r.id !== id))}
                        onEdit={handleEditRole} // Pass the onEdit callback for inline editing
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, roles.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={roles.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </Box>
    </DashboardContent>
  );
}
