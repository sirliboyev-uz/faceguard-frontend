import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Company',
    path: '/company',
    icon: icon('ic-company'),
    // submenu: [
    //   {
    //     title: 'Company',
    //     path: '/company',
    //   },
    //   {
    //     title: 'Branch',
    //     path: '/branch',
    //   },
    //   {
    //     title: 'Department',
    //     path: '/department',
    //   },
    // ],
  },
  {
    title: 'Branch',
    path: '/branch',
    icon: icon('ic-branch'),
  },
  {
    title: 'Department',
    path: '/department',
    icon: icon('ic-department'),
  },
  {
    title: 'Employee',
    path: '/employee',
    icon: icon('ic-user'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Role',
    path: '/role',
    icon: icon('role'),
  },
  {
    title: 'Attendance',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Live',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
