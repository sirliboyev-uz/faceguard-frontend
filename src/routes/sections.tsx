import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from 'src/layouts/auth/ProtectedRoute';

// Lazy loading pages
export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/user-register'));
export const CompanyRegister = lazy(() => import('src/pages/company-register'));
export const CompanyPage = lazy(() => import('src/pages/company'));
export const CompanyEditPage = lazy(() => import('src/pages/company-edit'));
export const BranchPage = lazy(() => import('src/pages/branch-page'));
export const BranchCreatePage = lazy(() => import('src/pages/branch-create-page'));
export const BranchEditPage = lazy(() => import('src/pages/branch-edit-page'));
export const DepartmentPage = lazy(() => import('src/pages/department-page'));
export const DepartmentCreatePage = lazy(() => import('src/pages/department-create-page'));
export const DepartmentEditPage = lazy(() => import('src/pages/department-edit-page'));
export const PermissionDeniedView = lazy(() => import('src/pages/permission-denied'));  // 🔹 Add this
export const RolePage = lazy(() => import('src/pages/role-page'));
export const EmployeePage = lazy(() => import('src/pages/employee-page'));
export const EmployeeCreatePage = lazy(() => import('src/pages/employee-create-page'));




const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <ProtectedRoute />,  // 🔹 Ensure ProtectedRoute is properly handling errors
      children: [
        {
          element: (
            <DashboardLayout>
              <Suspense fallback={renderFallback}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          ),
          children: [
            { element: <HomePage />, index: true },
            { path: 'user', element: <UserPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'blog', element: <BlogPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'company', element: <CompanyPage /> },
            { path: 'company-register', element: <CompanyRegister /> },
            { path: 'company-edit/:id', element: <CompanyEditPage /> },
            { path: 'branch', element: <BranchPage /> },
            { path: 'branch-register', element: <BranchCreatePage /> },
            { path: 'branch-edit/:id', element: <BranchEditPage /> },
            { path: 'department', element: <DepartmentPage /> },
            { path: 'department-register', element: <DepartmentCreatePage /> },
            { path: 'department-edit/:id', element: <DepartmentEditPage /> },
            { path: 'role', element: <RolePage /> },
            { path: 'employee', element: <EmployeePage /> },
            { path: 'emp-register', element: <EmployeeCreatePage /> },



          ],
        },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'permission-denied',
      element: <PermissionDeniedView />,  // 🔹 Add permission denied route
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
