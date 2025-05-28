import { Helmet } from 'react-helmet-async';
// sections
import { DocumentTypeCreateView } from 'src/sections/documentType/view';

// ----------------------------------------------------------------------

export default function DocumentTypeCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new documentType</title>
      </Helmet>

      <DocumentTypeCreateView />
    </>
  );
}
