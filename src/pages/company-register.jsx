import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyCreatePage } from 'src/custom/companyUtils/company-create-page';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Company Register - ${CONFIG.appName}`}</title>
      </Helmet>

      <CompanyCreatePage />
    </>
  );
}
