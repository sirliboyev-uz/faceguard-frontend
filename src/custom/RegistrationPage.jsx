import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Box, Card, TextField, Button, MenuItem, Typography, InputLabel, Select, FormControl, Grid } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string().required('Middle name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  birthDate: yup.date().required('Birth date is required'),
  gender: yup.string().required('Gender is required'),
  jobTitle: yup.string().required('Job title is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password should be at least 6 characters').required('Password is required'),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Repeat password is required'),
  roleId: yup.number().required('Role is required'),
  companyId: yup.number().required('Company is required'),
  image: yup.mixed().required('Profile image is required'),
});

export function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]); // Backend'dan kelgan kompaniyalar
  const [roles, setRoles] = useState([]); // Backend'dan kelgan rollar


  // Tokenni localStorage'dan olish
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Kompaniyalar ro'yxatini olish
    axios.get('http://localhost:8080/api/v1/company/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setCompanies(response.data);
    })
    .catch((err) => {
      console.err("Failed to fetch companies:", err);
    });
  }, [token]);
  useEffect(() => {
    // Rollar ro'yxatini olish
    axios.get('http://localhost:8080/api/v1/role/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setRoles(response.data);
    })
    .catch((err) => {
      console.error("Failed to fetch companies:", err);
    });
  }, [token]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phoneNumber: '',
      birthDate: '',
      gender: '',
      jobTitle: '',
      username: '',
      password: '',
      repeatPassword: '',
      roleId: '',
      companyId: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === 'image') {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key].toString());
          }
        });

        await axios.post('http://localhost:8080/api/v1/user/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        navigate('/user');
      } catch (err) {
        setError('Failed to register user');
      }
    },
  });

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Register</Typography>
      </Box>
      <Card sx={{ p: 3, maxWidth: 800 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="First Name" name="firstName" {...formik.getFieldProps('firstName')} error={formik.touched.firstName && Boolean(formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Last Name" name="lastName" {...formik.getFieldProps('lastName')} error={formik.touched.lastName && Boolean(formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Middle Name" name="middleName" {...formik.getFieldProps('middleName')} error={formik.touched.middleName && Boolean(formik.errors.middleName)} helperText={formik.touched.middleName && formik.errors.middleName} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email" name="email" {...formik.getFieldProps('email')} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone Number" name="phoneNumber" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" label="Birth Date" name="birthDate" {...formik.getFieldProps('birthDate')} InputLabelProps={{ shrink: true }} error={formik.touched.birthDate && Boolean(formik.errors.birthDate)} helperText={formik.touched.birthDate && formik.errors.birthDate} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Job Title" name="jobTitle" {...formik.getFieldProps('jobTitle')} error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)} helperText={formik.touched.jobTitle && formik.errors.jobTitle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Username" name="username" {...formik.getFieldProps('username')} error={formik.touched.username && Boolean(formik.errors.username)} helperText={formik.touched.username && formik.errors.username} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="password" label="Password" name="password" {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="password" label="Repeat Password" name="repeatPassword" {...formik.getFieldProps('repeatPassword')} error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)} helperText={formik.touched.repeatPassword && formik.errors.repeatPassword} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select name="roleId" value={formik.values.roleId} onChange={formik.handleChange}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Company</InputLabel>
                <Select name="companyId" value={formik.values.companyId} onChange={formik.handleChange}>
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])} />
              {formik.errors.image && <Typography color="error">{formik.errors.image}</Typography>}
            </Grid>
          </Grid>

          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">Register</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/user')}>Cancel</Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}
