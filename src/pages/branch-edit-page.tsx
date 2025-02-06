import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BranchEditPage } from 'src/custom/BranchEditPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Branch - ${CONFIG.appName}`}</title>
      </Helmet>

      <BranchEditPage />
    </>
  );
}
