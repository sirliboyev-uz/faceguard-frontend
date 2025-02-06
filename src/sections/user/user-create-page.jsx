import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  firstName: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  role: yup.string().required('Role is required'),
  password: yup.string().min(6, 'Password should be at least 6 characters').required('Password is required'),
});

export function UserCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      email: '',
      role: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        await axios.post('http://localhost:8080/api/v1/auth/register', values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate('/user'); // Redirect back to users list
      } catch (err) {
        setError('Failed to create user');
      }
    },
  });

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Add New User</Typography>
      </Box>
      <Card sx={{ p: 3, maxWidth: 500 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
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
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/users')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}
