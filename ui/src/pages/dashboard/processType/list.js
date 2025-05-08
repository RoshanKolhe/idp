import { Helmet } from 'react-helmet-async';
// sections
import { ProcessTypeListView } from 'src/sections/processType/view';

// ----------------------------------------------------------------------

export default function ProcessTypeListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ProcessType List</title>
      </Helmet>

      <ProcessTypeListView />
    </>
  );
}
