import { Helmet } from 'react-helmet-async';
// sections
import { ProcessInstanceListView } from 'src/sections/processInstance/view';

// ----------------------------------------------------------------------

export default function ProcessInstanceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ProcessInstance List</title>
      </Helmet>

      <ProcessInstanceListView />
    </>
  );
}
