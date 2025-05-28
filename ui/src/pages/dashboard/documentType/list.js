import { Helmet } from 'react-helmet-async';
// sections
import { DocumentTypeListView } from 'src/sections/documentType/view';

// ----------------------------------------------------------------------

export default function DocumentTypeListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: DocumentType List</title>
      </Helmet>

      <DocumentTypeListView />
    </>
  );
}
