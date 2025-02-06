import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DepartmentEditPage } from 'src/custom/DepartmentEditPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Department - ${CONFIG.appName}`}</title>
      </Helmet>

      <DepartmentEditPage />
    </>
  );
}
