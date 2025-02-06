import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DepartmentCreatePage } from 'src/custom/departmentUtils/department-create-page';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Company Register - ${CONFIG.appName}`}</title>
      </Helmet>

      <DepartmentCreatePage />
    </>
  );
}
