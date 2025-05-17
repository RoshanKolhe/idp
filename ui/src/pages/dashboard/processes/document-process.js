import { Helmet } from 'react-helmet-async';
// sections
import { IntelligentDocumentProcessing } from 'src/sections/processes/view';

// ----------------------------------------------------------------------

export default function DocumentProcessPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Intelligent Document Process</title>
      </Helmet>

      <IntelligentDocumentProcessing />
    </>
  );
}
