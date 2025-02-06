import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RegistrationPage } from 'src/custom/RegistrationPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Registration - ${CONFIG.appName}`}</title>
      </Helmet>

      <RegistrationPage />
    </>
  );
}
