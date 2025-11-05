import { Helmet } from 'react-helmet-async';
import ProcessesView from 'src/sections/processes/view/processes-view';
// sections


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
