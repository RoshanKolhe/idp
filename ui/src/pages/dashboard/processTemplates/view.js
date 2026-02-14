import { Helmet } from 'react-helmet-async';
// sections
import ProcessTemplateView from 'src/sections/process-templates/view/process-template-view';

// ----------------------------------------------------------------------

export default function ProcessTemplateViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Process Template View</title>
      </Helmet>

      <ProcessTemplateView />
    </>
  );
}
