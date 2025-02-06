import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PermissionDeniedView } from 'src/sections/denied/PermissionDeniedView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`403 Permission denied! | Error - ${CONFIG.appName}`}</title>
      </Helmet>

      <PermissionDeniedView />
    </>
  );
}
