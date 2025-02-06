import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeePage } from 'src/custom/EmployeePage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Registration - ${CONFIG.appName}`}</title>
      </Helmet>

      <EmployeePage />
    </>
  );
}
