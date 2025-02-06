import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyEditPage } from 'src/custom/CompanyEditPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Company Register - ${CONFIG.appName}`}</title>
      </Helmet>

      <CompanyEditPage />
    </>
  );
}
