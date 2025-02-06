import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyPage } from 'src/custom/CompanyPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Company - ${CONFIG.appName}`}</title>
      </Helmet>

      <CompanyPage />
    </>
  );
}
