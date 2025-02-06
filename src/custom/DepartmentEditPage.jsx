import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  branchId: yup.string().required("Branch is required"),
});

export function DepartmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Fetch department details
        const deptResponse = await axios.get(
          `http://localhost:8080/api/v1/department/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDepartment(deptResponse.data);

        // Fetch branches only for this department's company
        const branchResponse = await axios.get(
          `http://localhost:8080/api/v1/branch/list-by-department/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBranches(branchResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: department?.name || "",
      branchId: department?.branch?.id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        await axios.put(
          `http://localhost:8080/api/v1/department/update/${id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        navigate("/department"); // Redirect after saving
      } catch (err) {
        setError("Failed to update department");
      }
    },
  });

  if (!department) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Edit Department</Typography>
      </Box>
      <Card sx={{ p: 3, maxWidth: 500 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Department Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Branch</InputLabel>
            <Select
              name="branchId"
              value={formik.values.branchId}
              onChange={formik.handleChange}
              error={formik.touched.branchId && Boolean(formik.errors.branchId)}
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate("/department")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}
