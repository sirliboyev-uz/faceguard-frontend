import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RolePage } from 'src/custom/RolePage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Registration - ${CONFIG.appName}`}</title>
      </Helmet>

      <RolePage />
    </>
  );
}
