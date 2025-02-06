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
import { BranchTableRow } from 'src/custom/branchUtils/branch-table-row';
import { BranchTableHead } from 'src/custom/branchUtils/branch-table-head';
import { TableEmptyRows } from 'src/custom/companyUtils/table-empty-rows';
import { BranchTableToolbar } from 'src/custom/branchUtils/branch-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/custom/branchUtils/utils';

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

export function BranchPage() {
  const navigate = useNavigate();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/v1/branch/list', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("API Response:", response.data);

        const formattedBranches = response.data.map(({ id, name, description, location, longitude, latitude, departmentCount, company }) => ({
          id, name, description, location, longitude, latitude, departmentCount, company
        }));

        setBranches(formattedBranches);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError('Failed to fetch branch data');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const dataFiltered = applyFilter({
    inputData: Array.isArray(branches) ? branches : [],
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
          Branches
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/branch-register')}
        >
          New Branch
        </Button>
      </Box>

      <Card>
        <BranchTableToolbar
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
              <BranchTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={branches.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    branches.map((branch) => branch.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Branch Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'location', label: 'Location' },
                  { id: 'longitude', label: 'Longitude' },
                  { id: 'latitude', label: 'Latitude' },
                  { id: 'departmentCount', label: 'Departments' },
                  { id: 'company', label: 'Company' },
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
                    <BranchTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={(id) => setBranches((prev) => prev.filter((b) => b.id !== id))}
                    />
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, branches.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination component="div" page={table.page} count={branches.length} rowsPerPage={table.rowsPerPage} onPageChange={table.onChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={table.onChangeRowsPerPage} />
      </Card>
    </DashboardContent>
  );
}
