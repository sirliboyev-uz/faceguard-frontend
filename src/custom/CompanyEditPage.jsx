import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
});

export function CompanyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/v1/company/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(response.data);
      } catch (err) {
        setError('Failed to fetch company data');
      }
    };

    fetchCompany();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: company?.name || '',
      address: company?.address || '',
      email: company?.email || '',
      phone: company?.phone || '',
    },
    validationSchema,
    enableReinitialize: true, // Allow reinitializing the form once company data is fetched
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        await axios.put(`http://localhost:8080/api/v1/company/update/${id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate('/company'); // Redirect to the companies list after saving
      } catch (err) {
        setError('Failed to update company');
      }
    },
  });

  if (!company) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Edit Company</Typography>
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
            label="Address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/company')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}
