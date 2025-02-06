import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DepartmentPage } from 'src/custom/DepartmentPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Department - ${CONFIG.appName}`}</title>
      </Helmet>

      <DepartmentPage />
    </>
  );
}
