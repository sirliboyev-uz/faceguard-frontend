import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BranchPage } from 'src/custom/BranchPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Branch - ${CONFIG.appName}`}</title>
      </Helmet>

      <BranchPage />
    </>
  );
}
