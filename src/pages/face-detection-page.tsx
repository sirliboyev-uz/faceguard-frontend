import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VideoStream } from 'src/custom/FaceDetection';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Visitor - ${CONFIG.appName}`}</title>
      </Helmet>

      <VideoStream />
    </>
  );
}
