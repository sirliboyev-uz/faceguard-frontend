import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeeCreatePage } from 'src/custom/employeeUtils/employee-create-page';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Department - ${CONFIG.appName}`}</title>
      </Helmet>

      <EmployeeCreatePage />
    </>
  );
}
