import { Helmet } from 'react-helmet-async';
// sections
import { ProcessTemplateCreateView } from 'src/sections/process-templates/view';

// ----------------------------------------------------------------------

export default function ProcessTemplateCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new processInstance</title>
      </Helmet>

      <ProcessTemplateCreateView />
    </>
  );
}
