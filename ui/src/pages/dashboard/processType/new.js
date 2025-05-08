import { Helmet } from 'react-helmet-async';
// sections
import { ProcessTypeCreateView } from 'src/sections/processType/view';

// ----------------------------------------------------------------------

export default function ProcessTypeCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new processType</title>
      </Helmet>

      <ProcessTypeCreateView />
    </>
  );
}
