import { Helmet } from 'react-helmet-async';
// sections
import ProcessesEditView from 'src/sections/processType/view/processType-edit-view';

// ----------------------------------------------------------------------

export default function ProcessesEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Processes Edit</title>
      </Helmet>

      <ProcessesEditView />
    </>
  );
}
