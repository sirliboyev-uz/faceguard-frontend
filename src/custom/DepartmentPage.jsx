import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from 'src/custom/companyUtils/table-no-data';
import { DepartmentTableRow } from 'src/custom/departmentUtils/department-table-row';
import { DepartmentTableHead } from 'src/custom/departmentUtils/department-table-head';
import { TableEmptyRows } from 'src/custom/companyUtils/table-empty-rows';
import { DepartmentTableToolbar } from 'src/custom/departmentUtils/department-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/custom/departmentUtils/utils';

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');

  const onSort = useCallback((id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((inputValue) => {
    setSelected((prevSelected) =>
      prevSelected.includes(inputValue)
        ? prevSelected.filter((value) => value !== inputValue)
        : [...prevSelected, inputValue]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_, newPage) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    onResetPage();
  }, [onResetPage]);

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

export function DepartmentPage() {
  const navigate = useNavigate();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }
  
        const response = await axios.get('http://localhost:8080/api/v1/department/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // console.log("API Response:", response.data);
  
        // Adjust mapping to include branchName
        const formattedDepartments = response.data.map(({ id, name, branchName, employeeCount }) => ({
          id, name, branchName, employeeCount
        }));
  
        setDepartments(formattedDepartments);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError('Failed to fetch department data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDepartments();
  }, []);
  

  const dataFiltered = applyFilter({
    inputData: Array.isArray(departments) ? departments : [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Departments
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/department-register')}
        >
          New Department
        </Button>
      </Box>

      <Card>
        <DepartmentTableToolbar
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
              <DepartmentTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={departments.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    departments.map((department) => department.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Department Name' },
                  { id: 'branchId', label: 'Branch' },
                  { id: 'employeeCount', label: 'Employees' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <DepartmentTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={(id) => setDepartments((prev) => prev.filter((d) => d.id !== id))}
                    />
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, departments.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination component="div" page={table.page} count={departments.length} rowsPerPage={table.rowsPerPage} onPageChange={table.onChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={table.onChangeRowsPerPage} />
      </Card>
    </DashboardContent>
  );
}
