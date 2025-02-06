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
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  longitude: yup.number().required('Longitude is required'),
  latitude: yup.number().required('Latitude is required'),
  companyId: yup.string().required('Company is required'),
});

export function BranchCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);

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
      }
    };
    fetchCompanies();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      location: '',
      longitude: '',
      latitude: '',
      companyId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        await axios.post('http://localhost:8080/api/v1/branch/register', values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate('/branch');
      } catch (err) {
        setError('Failed to create branch');
      }
    },
  });

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Add New Branch</Typography>
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
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Longitude"
            name="longitude"
            type="number"
            value={formik.values.longitude}
            onChange={formik.handleChange}
            error={formik.touched.longitude && Boolean(formik.errors.longitude)}
            helperText={formik.touched.longitude && formik.errors.longitude}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Latitude"
            name="latitude"
            type="number"
            value={formik.values.latitude}
            onChange={formik.handleChange}
            error={formik.touched.latitude && Boolean(formik.errors.latitude)}
            helperText={formik.touched.latitude && formik.errors.latitude}
            margin="normal"
          />
          <FormControl fullWidth margin="normal" error={formik.touched.companyId && Boolean(formik.errors.companyId)}>
            <InputLabel>Company</InputLabel>
            <Select
              name="companyId"
              value={formik.values.companyId}
              onChange={formik.handleChange}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/branch')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}
