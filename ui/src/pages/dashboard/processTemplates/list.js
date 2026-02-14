import { Helmet } from 'react-helmet-async';
// sections
import { ProcessTemplateListView } from 'src/sections/process-templates/view';

// ----------------------------------------------------------------------

export default function ProcessTemplateListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Process Template List</title>
      </Helmet>

      <ProcessTemplateListView />
    </>
  );
}
