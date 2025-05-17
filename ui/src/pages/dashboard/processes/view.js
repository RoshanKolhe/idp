import { Helmet } from 'react-helmet-async';
// sections
import ProcessesView from 'src/sections/processType/view/processType-view';

// ----------------------------------------------------------------------

export default function ProcessesViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Processes View</title>
      </Helmet>

      <ProcessesView />
    </>
  );
}
