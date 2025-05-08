import { Helmet } from 'react-helmet-async';
// sections
import ProcessTypeEditView from 'src/sections/processType/view/processType-edit-view';

// ----------------------------------------------------------------------

export default function ProcessTypeEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ProcessType Edit</title>
      </Helmet>

      <ProcessTypeEditView />
    </>
  );
}
