import { Helmet } from 'react-helmet-async';
// sections
import { ProcessInstanceCreateView } from 'src/sections/processInstance/view';

// ----------------------------------------------------------------------

export default function ProcessInstanceCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new processInstance</title>
      </Helmet>

      <ProcessInstanceCreateView />
    </>
  );
}
