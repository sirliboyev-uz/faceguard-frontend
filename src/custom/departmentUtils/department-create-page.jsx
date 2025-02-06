import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { DashboardContent } from 'src/layouts/dashboard';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  branchId: yup.string().required('Branch is required'),
});

export function DepartmentCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/v1/company/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(response.data);
      } catch (err) {
        console.error('Failed to fetch companies', err);
        setError('Failed to fetch companies');
      }
    };
    fetchCompanies();
  }, []);

  const fetchBranches = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/v1/branch/list/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(response.data);
    } catch (err) {
      console.error('Failed to fetch branches', err);
      setError('Failed to fetch branches');
    }
  };

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    setSelectedCompany(companyId);
    fetchBranches(companyId);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      branchId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        await axios.post('http://localhost:8080/api/v1/department/register', values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate('/department');
      } catch (err) {
        setError('Failed to create department');
      }
    },
  });

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Add New Department</Typography>
      </Box>
      <Card sx={{ p: 3, maxWidth: 500 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />
          
          {/* Company Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Company</InputLabel>
            <Select
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Branch Select */}
          <FormControl fullWidth margin="normal" error={formik.touched.branchId && Boolean(formik.errors.branchId)}>
            <InputLabel>Branch</InputLabel>
            <Select
              name="branchId"
              value={formik.values.branchId}
              onChange={formik.handleChange}
              disabled={!selectedCompany} // Disable if no company is selected
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.branchId && formik.errors.branchId && (
              <Typography color="error" variant="body2">
                {formik.errors.branchId}
              </Typography>
            )}
          </FormControl>

          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/department')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}
