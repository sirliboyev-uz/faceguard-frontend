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
import { CompanyTableRow } from 'src/custom/companyUtils/company-table-row';
import { CompanyTableHead } from 'src/custom/companyUtils/company-table-head';
import { TableEmptyRows } from 'src/custom/companyUtils/table-empty-rows';
import { CompanyTableToolbar } from 'src/custom/companyUtils/company-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/custom/companyUtils/utils';

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

export function CompanyPage() {
  const navigate = useNavigate();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }
  
        const response = await axios.get('http://localhost:8080/api/v1/company/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // console.log("API Response:", response.data);
  
        const formattedCompanies = response.data.map(({ id, name, email, phone, address, branchCount, departmentCount }) => ({
          id, name, email, phone, address, branchCount, departmentCount
        }));
  
        setCompanies(formattedCompanies);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError('Failed to fetch company data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanies();
  }, []);
  
  const dataFiltered = applyFilter({
    inputData: Array.isArray(companies) ? companies : [],
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
          Companies
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/company-register')}
        >
          New Company
        </Button>
      </Box>

      <Card>
        <CompanyTableToolbar
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
              <CompanyTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={companies.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    companies.map((company) => company.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Company Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'address', label: 'Address' },
                  { id: 'branchCount', label: 'Branches' },
                  { id: 'departmentCount', label: 'Departments' },
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
                    <CompanyTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={(id) => setCompanies((prev) => prev.filter((c) => c.id !== id))}
                    />
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, companies.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination component="div" page={table.page} count={companies.length} rowsPerPage={table.rowsPerPage} onPageChange={table.onChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={table.onChangeRowsPerPage} />
      </Card>
    </DashboardContent>
  );
}
