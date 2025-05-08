import { Helmet } from 'react-helmet-async';
// sections
import ProcessTypeView from 'src/sections/processType/view/processType-view';

// ----------------------------------------------------------------------

export default function ProcessTypeViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ProcessType View</title>
      </Helmet>

      <ProcessTypeView />
    </>
  );
}
