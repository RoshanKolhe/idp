import { Helmet } from 'react-helmet-async';
// sections
import { ProcessTemplateEditView } from 'src/sections/process-templates/view';

// ----------------------------------------------------------------------

export default function ProcessTemplateEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Process Template Edit</title>
      </Helmet>

      <ProcessTemplateEditView />
    </>
  );
}
