import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BranchCreatePage } from 'src/custom/branchUtils/branch-create-page';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Company Register - ${CONFIG.appName}`}</title>
      </Helmet>

      <BranchCreatePage />
    </>
  );
}
