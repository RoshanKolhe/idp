import { Helmet } from 'react-helmet-async';
// sections
import { ProcessInstanceEditView } from 'src/sections/processInstance/view';

// ----------------------------------------------------------------------

export default function ProcessInstanceEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ProcessInstance Edit</title>
      </Helmet>

      <ProcessInstanceEditView />
    </>
  );
}
